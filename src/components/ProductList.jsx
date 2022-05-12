import {
    ResourceList,
    TextStyle,
    Card,
    ResourceItem,
    Avatar,
    Banner,
    Pagination, Filters
} from "@shopify/polaris";
import {gql, useLazyQuery} from "@apollo/client";
import {Loading} from "@shopify/app-bridge-react";
import {useCallback, useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";

const GET_PRODUCT_PAGE = gql`
    query getProducts($first: Int, $last: Int, $after: String, $before: String, $query: String) {
        products(first: $first, last: $last, after: $after, before: $before, query: $query) {
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
    const [queryValue, setQueryValue] = useState(null);

    const handleFiltersQueryChange = useCallback(
        (value) => setQueryValue(value),
        [],
    );
    const handleQueryValueRemove = useCallback(() => setQueryValue(null), []);
    const handleFiltersClearAll = useCallback(() => {
        handleQueryValueRemove();
    }, [
        handleQueryValueRemove,
    ]);



    const [getProduct, {loading, error, data, refetch}] = useLazyQuery(GET_PRODUCT_PAGE);

    useEffect(() => {
        getProduct({
            variables: {
                first: 10,
            }
        });
    }, []);

    useEffect(() => {
        refetch({
            query: queryValue
        });
    }, [queryValue]);

    if (error) {
        console.warn(error);
        return (
            <Banner status="critical">There was an issue loading products.</Banner>
        );
    }

    if (loading || !data) return <Loading/>;


    const onNext = () => {
        const edges = data.products.edges;
        getProduct({
            variables: {
                first: 10,
                after: edges[edges.length - 1].cursor
            }
        });
    };

    const onPrevious = () => {
        const edges = data.products.edges;
        getProduct({
            variables: {
                last: 10,
                before: edges[0].cursor
            }
        });
    };

    return (
        <Card sectioned>
            <ResourceList
                resourceName={{singular: 'customer', plural: 'customers'}}
                items={data.products.edges}
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

                    return (
                        <ResourceItem
                            id={id}
                            media={media}
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
            <Pagination hasPrevious={data.products.pageInfo.hasPreviousPage} onPrevious={onPrevious} onNext={onNext}
                        hasNext={data.products.pageInfo.hasNextPage}/>
        </Card>
    );
}
