import {gql} from "@apollo/client";

export const GET_PRODUCT_PAGE = gql`
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

export const CREATE_PRODUCT = gql`
    mutation populateProduct($input: ProductInput!) {
        productCreate(input: $input) {
            product {
                title
                descriptionHtml
            }
        }
    }
`;

export const UPDATE_PRODUCT = gql`
    mutation productUpdate($input: ProductInput!) {
        productUpdate(input: $input) {
            product {
                id
                title
                descriptionHtml
            }
        }
    }
`;

export const GET_PRODUCT = gql`
    query getProduct($id: ID!) {
        product(id: $id) {
            title
            description
        }
    }
`;

export const PRODUCTS_QUERY = gql`
    mutation populateProduct($input: ProductInput!) {
        productCreate(input: $input) {
            product {
                title
            }
        }
    }
`;

