import {
    Page,
    FormLayout,
    TextField,
    Form,
    Button,
    Banner,
} from "@shopify/polaris";
import {useCallback, useEffect, useMemo, useState} from "react";
import {useMutation, useQuery} from "@apollo/client";
import {Loading, TitleBar, useClientRouting, useRoutePropagation} from "@shopify/app-bridge-react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {GET_PRODUCT, UPDATE_PRODUCT} from "../graphql/queries.js";


export function ProductUpdateForm() {
    // Route Propagator and Client Routing
    let location = useLocation();
    let navigate = useNavigate();
    useRoutePropagation(location);
    useClientRouting({
        replace(path) {
            navigate(path);
        }
    });

    // Route params
    const {id} = useParams();

    // States
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');


    // Queries and mutation
    const {data, loading: loadingGet, error: errorGet} = useQuery(GET_PRODUCT, {
        variables: {
            id: 'gid://shopify/Product/' + id
        }
    });
    const [productUpdate, {loading: loadingUpdate, error: errorUpdate}] = useMutation(UPDATE_PRODUCT);

    // Handlers
    const handleTitleChange = useCallback((value) => setTitle(value), []);
    const handleDescriptionChange = useCallback((value) => setDescription(value), []);
    const handleSubmit = useCallback(() => {
        if (title && title.trim()) {
            productUpdate({
                variables: {
                    input: {
                        id: 'gid://shopify/Product/' + id,
                        title: title.trim(),
                        descriptionHtml: `<p>${description}</p>`,
                    }
                }
            }).then(() => {
                setTitle('');
                setDescription('');
                navigate('/products');
            });
        }
    }, [title, description]);

    // Variables
    const isCanUpdate = useMemo(() => {
        return data ? title !== data.product.title || description !== data.product.description : false;
    }, [title, description, data]);

    // Set states after query response
    useEffect(() => {
        if (data) {
            setTitle(data.product.title);
            setDescription(data.product.description);
        }
    }, [data])

    // Error banner
    if (errorGet || errorUpdate) {
        console.warn(errorGet || errorUpdate);
        return (
            <Banner status="critical">There was an issue loading product.</Banner>
        );
    }


    return (
        <Page title='Update product'>
            <TitleBar
                title="Update product"
                primaryAction={null}
            />
            {(loadingGet || loadingUpdate) && <Loading/>}
            <Form onSubmit={handleSubmit}>
                <FormLayout>
                    <TextField
                        value={title}
                        disabled={loadingGet || loadingUpdate}
                        requiredIndicator
                        type="text"
                        label="Product title"
                        onChange={handleTitleChange}
                        autoComplete="off"/>
                    <TextField
                        value={description}
                        disabled={loadingGet || loadingUpdate}
                        type="text"
                        label="Product description"
                        onChange={handleDescriptionChange}
                        autoComplete="off"
                    />
                    <Button submit disabled={loadingGet || loadingUpdate || !isCanUpdate}>Save</Button>
                </FormLayout>
            </Form>
        </Page>
    );
}
