import {
    ResourceList,
    TextStyle,
    Card,
    ResourceItem,
    Avatar,
    Banner,
    Pagination
} from "@shopify/polaris";
import {gql, useLazyQuery} from "@apollo/client";
import {Loading} from "@shopify/app-bridge-react";
import {useEffect, useState} from "react";

const GET_PRODUCT_PAGE = gql`
    query getProducts($first: Int, $last: Int, $after: String, $before: String) {
        products(first: $first, last: $last, after: $after, before: $before) {
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
    const [queryData, setQueryData] = useState(null);
    const [getProduct, {loading, error, data, refetch}] = useLazyQuery(GET_PRODUCT_PAGE);
    useEffect(() => {
        getProduct({variables: {first: 10}}).then(res => {
            setQueryData(res.data);
        });
    }, []);

    if (loading || !queryData) return <Loading/>;

    if (error) {
        console.warn(error);
        return (
            <Banner status="critical">There was an issue loading products.</Banner>
        );
    }

    return (
        <Card sectioned>
            <ResourceList
                resourceName={{singular: 'customer', plural: 'customers'}}
                items={queryData.products.edges}
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
            <Pagination hasPrevious={queryData.products.pageInfo.hasPreviousPage} onPrevious={() => {
                console.log('Previous');
                const edges = queryData.products.edges;
                getProduct({
                    variables: {
                        last: 10,
                        before: edges[0].cursor
                    }
                }).then(res => setQueryData(res.data));
            }} onNext={() => {
                console.log('Next');
                const edges = queryData.products.edges;
                getProduct({
                    variables: {
                        first: 10,
                        after: edges[edges.length - 1].cursor
                    }
                }).then(res => setQueryData(res.data));
            }} hasNext={queryData.products.pageInfo.hasNextPage}/>
        </Card>
    );
}
