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
    Layout, TextField
} from "@shopify/polaris";
import {gql, useLazyQuery} from "@apollo/client";
import {Loading, useClientRouting, useRoutePropagation} from "@shopify/app-bridge-react";
import {useCallback, useEffect, useMemo, useState} from "react";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import {useDebouncedEffect} from "../customHooks/useDebouncedEffect.jsx";

const GET_PRODUCT_PAGE = gql`
    query getProducts($first: Int, $last: Int, $after: String, $before: String, $query: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
        products(first: $first, last: $last, after: $after, before: $before, query: $query, sortKey: $sortKey, reverse: $reverse) {
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
            edges {
                cursor
                node {
                    title
                    id
                    vendor
                }
            }
        }
    }
`;

export function ProductsList() {
    let [searchParams, setSearchParams] = useSearchParams({sort: 'TITLE_A-Z'});
    const [queryValue, setQueryValue] = useState('');

    let location = useLocation();
    let navigate = useNavigate();
    useRoutePropagation(location);
    useClientRouting({
        replace(path) {
            navigate(path);
        }
    });


    const currentParams = useMemo(() => Object.fromEntries([...searchParams]), [searchParams]);
    const isReverse = useMemo(() => searchParams.get('sort') === 'TITLE_Z-A', [searchParams]);


    const handleFiltersQueryChange = useCallback(
        (value) => setQueryValue(value),
        [],
    );
    const handleQueryValueRemove = useCallback(() => setQueryValue(''), []);
    const handleFiltersClearAll = useCallback(() => {
        handleQueryValueRemove();
    }, [
        handleQueryValueRemove,
    ]);


    const [getProduct, {loading, error, data, previousData}] = useLazyQuery(GET_PRODUCT_PAGE);

    useDebouncedEffect(() => {
        setSearchParams({...currentParams, queryValue})
    }, [queryValue], 300);

    useEffect(() => {
        getProduct({
            variables: {
                first: 10,
                query: searchParams.get('queryValue'),
                sortKey: 'TITLE',
                reverse: isReverse,
            }
        });
    }, [searchParams]);


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


    if (error) {
        console.warn(error);
        return (
            <Banner status="critical">There was an issue loading products.</Banner>
        );
    }

    if (!previousData && !data) return <Loading/>;

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
                                    filters={[]}
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
