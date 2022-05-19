import {
    ResourceList,
    TextStyle,
    Card,
    ResourceItem,
    Avatar,
    Banner,
    Pagination,
    Filters,
    Page,
    Layout,
    TextField
} from "@shopify/polaris";
import {useLazyQuery} from "@apollo/client";
import {Loading, useClientRouting, useRoutePropagation} from "@shopify/app-bridge-react";
import {useCallback, useEffect, useMemo, useState} from "react";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import {useDebouncedEffect} from "../customHooks/useDebouncedEffect.jsx";
import {GET_PRODUCT_PAGE} from "../graphql/queries.js";


export function ProductsList() {
    // Search params
    let [searchParams, setSearchParams] = useSearchParams({sort: 'TITLE_A-Z'});

    // States
    const [queryValue, setQueryValue] = useState('');
    const [taggedWith, setTaggedWith] = useState('');

    // Route Propagator and Client Routing
    let location = useLocation();
    let navigate = useNavigate();
    useRoutePropagation(location);
    useClientRouting({
        replace(path) {
            navigate(path);
        }
    });

    // Variables
    const currentParams = useMemo(() => Object.fromEntries([...searchParams]), [searchParams]);
    const isReverse = useMemo(() => searchParams.get('sort') === 'TITLE_Z-A', [searchParams]);
    const queryParams = useMemo(() => {
        if (searchParams.get('queryValue') && searchParams.get('taggedWith')) {
            return `(title:${searchParams.get('queryValue')}*) AND (tag:${searchParams.get('taggedWith')})`;
        }
        if (searchParams.get('queryValue') && !searchParams.get('taggedWith')) {
            return `(title:${searchParams.get('queryValue')}*)`;
        }
        if (!searchParams.get('queryValue') && searchParams.get('taggedWith')) {
            return `(tag:${searchParams.get('taggedWith')})`;
        }
        if (!searchParams.get('queryValue') && !searchParams.get('taggedWith')) {
            return '';
        }
    }, [searchParams]);

    // Handlers
    const handleFiltersQueryChange = useCallback(
        (value) => setQueryValue(value),
        [],
    );
    const handleQueryValueRemove = useCallback(() => setQueryValue(''), []);
    const handleTaggedWithChange = useCallback(
        (value) => setTaggedWith(value),
        [],
    );
    const handleTaggedWithRemove = useCallback(() => setTaggedWith(''), []);
    const handleFiltersClearAll = useCallback(() => {
        handleQueryValueRemove();
        handleTaggedWithRemove();
    }, [
        handleQueryValueRemove,
        handleTaggedWithRemove,
    ]);

    // Get product query
    const [getProduct, {loading, error, data, previousData}] = useLazyQuery(GET_PRODUCT_PAGE);

    // Pagination actions
    const onNext = useCallback(() => {
        const edges = data.products.edges;
        getProduct({
            variables: {
                first: 10,
                last: null,
                after: edges[edges.length - 1].cursor,
                before: null,
                sortKey: 'TITLE',
                reverse: isReverse,
            }
        });
    }, [getProduct, data]);

    const onPrevious = useCallback(() => {
        const edges = data.products.edges;
        getProduct({
            variables: {
                first: null,
                last: 10,
                after: null,
                before: edges[0].cursor,
                sortKey: 'TITLE',
                reverse: isReverse,
            }
        });
    }, [getProduct, data]);

    // Update searchParams
    useDebouncedEffect(() => {
        setSearchParams({...currentParams, queryValue, taggedWith})
    }, [queryValue, taggedWith], 300);

    // Init query
    useEffect(() => {
        getProduct({
            variables: {
                first: 10,
                query: queryParams,
                sortKey: 'TITLE',
                reverse: isReverse,
            }
        });
    }, [searchParams]);

    // Error banner
    if (error) {
        console.warn(error);
        return (
            <Banner status="critical">There was an issue loading products.</Banner>
        );
    }

    // App Bridge loading
    if (!previousData && !data) return <Loading/>;

    // Filters
    const filters = [
        {
            key: 'taggedWith1',
            label: 'Tagged with',
            filter: (
                <TextField
                    label="Tagged with"
                    value={taggedWith}
                    onChange={handleTaggedWithChange}
                    autoComplete="off"
                    labelHidden
                />
            ),
            shortcut: true,
        },
    ];

    const appliedFilters = !isEmpty(taggedWith)
        ? [
            {
                key: 'taggedWith1',
                label: disambiguateLabel('taggedWith1', taggedWith),
                onRemove: handleTaggedWithRemove,
            },
        ]
        : [];


    return (
        <Page title='Product list' fullWidth>
            <Layout>
                <Layout.Section>
                    <Card sectioned>
                        <ResourceList
                            resourceName={{singular: 'product', plural: 'products'}}
                            loading={loading}
                            items={data ? data.products.edges : previousData.products.edges}
                            sortValue={searchParams.get('sort')}
                            sortOptions={[
                                {label: 'Title (A-Z)', value: 'TITLE_A-Z'},
                                {label: 'Title (Z-A)', value: 'TITLE_Z-A'},
                            ]}
                            onSortChange={(selected) => {
                                setSearchParams({...currentParams, sort: selected})
                                console.log(`Sort option changed to ${selected}.`);
                            }}
                            filterControl={
                                <Filters
                                    filters={filters}
                                    appliedFilters={appliedFilters}
                                    queryValue={queryValue}
                                    onQueryChange={handleFiltersQueryChange}
                                    onQueryClear={handleQueryValueRemove}
                                    onClearAll={handleFiltersClearAll}
                                />
                            }
                            renderItem={(item) => {
                                const {node: {title, id, vendor}} = item;
                                const media = <Avatar customer size="medium" name={title}/>;
                                const idProduct = id.substring(id.lastIndexOf('/')+1)
                                return (
                                    <ResourceItem
                                        id={id}
                                        media={media}
                                        onClick={()=>{navigate('/product-update/' + idProduct)}}
                                        accessibilityLabel={`View details for ${title}`}
                                    >
                                        <h3>
                                            <TextStyle variation="strong">{title}</TextStyle>
                                        </h3>
                                        <div>{vendor}</div>
                                    </ResourceItem>
                                );
                            }}
                        />
                        <Pagination hasPrevious={data && data.products.pageInfo.hasPreviousPage} onPrevious={onPrevious}
                                    onNext={onNext}
                                    hasNext={data && data.products.pageInfo.hasNextPage}/>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}


function disambiguateLabel(key, value) {
    switch (key) {
        case 'taggedWith1':
            return `Tagged with ${value}`;
        default:
            return value;
    }
}

function isEmpty(value) {
    if (Array.isArray(value)) {
        return value.length === 0;
    } else {
        return value === '' || value == null;
    }
}
