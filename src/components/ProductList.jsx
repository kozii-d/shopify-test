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
import {useCallback, useEffect, useState} from "react";

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
    const [getProduct, {loading, error, data, refetch}] = useLazyQuery(GET_PRODUCT_PAGE);
    useEffect(() => {
        getProduct({variables: {first: 10}});
    }, []);

    if (loading || !data) return <Loading/>;

    if (error) {
        console.warn(error);
        return (
            <Banner status="critical">There was an issue loading products.</Banner>
        );
    }

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
            <Pagination hasPrevious={data.products.pageInfo.hasPreviousPage} onPrevious={onPrevious} onNext={onNext} hasNext={data.products.pageInfo.hasNextPage}/>
        </Card>
    );
}
