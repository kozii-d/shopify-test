import {
    Page,
    FormLayout,
    TextField, Form, Button, Banner,
} from "@shopify/polaris";
import {useCallback, useEffect, useState} from "react";
import {gql, useLazyQuery, useMutation, useQuery} from "@apollo/client";
import {Loading, useClientRouting, useRoutePropagation} from "@shopify/app-bridge-react";
import {useLocation, useNavigate, useParams} from "react-router-dom";

const PRODUCTS_QUERY = gql`
    mutation populateProduct($input: ProductInput!) {
        productCreate(input: $input) {
            product {
                title
                descriptionHtml
            }
        }
    }
`;


const GET_PRODUCT = gql`
    query getProduct($id: ID!) {
        product(id: $id) {
            title
            description
        }
    }
`;


export function ProductForm() {
    let location = useLocation();
    let navigate = useNavigate();
    useRoutePropagation(location);
    useClientRouting({
        replace(path) {
            navigate(path);
        }
    });

    const [getProduct, { data }] = useLazyQuery(GET_PRODUCT, {
        variables: {
            id: `gid://shopify/Product/${useParams().id}`
        }
    });


    const [productCreate, {loading, error}] = useMutation(PRODUCTS_QUERY);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    // if (useParams().id) {
    //     useEffect(() => {
    //         getProduct().then(r => {
    //             setTitle(r.data.product.title)
    //             setDescription(r.data.product.description)
    //         })
    //         console.log(data)
    //     }, [])
    // }


    const handleTitleChange = useCallback((value) => setTitle(value), []);
    const handleDescriptionChange = useCallback((value) => setDescription(value), []);
    const handleSubmit = useCallback(() => {
        if (title && title.trim()) {
            console.log(title.trim())
            productCreate({
                variables: {
                    input: {
                        title: title.trim(),
                        descriptionHtml: `<p>${description}</p>`
                    }
                }
            });
            setTitle('');
            setDescription('');
        }
    }, [title, description]);

    if (error) {
        console.warn(error);
        return (
            <Banner status="critical">There was an issue loading products.</Banner>
        );
    }


    return (
        <Page title={useParams().id ? 'Change product' : 'Create product'}>
            {loading && <Loading/>}
            <Form onSubmit={handleSubmit}>
                <FormLayout>
                    <TextField
                        value={title}
                        disabled={loading}
                        requiredIndicator
                        type="text"
                        label="Product title"
                        onChange={handleTitleChange}
                        autoComplete="off"/>
                    <TextField
                        value={description}
                        disabled={loading}
                        type="text"
                        label="Product description"
                        onChange={handleDescriptionChange}
                        autoComplete="off"
                    />
                    <Button submit disabled={loading}>Save</Button>
                </FormLayout>
            </Form>
        </Page>
    );
}
