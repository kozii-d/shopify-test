import {
    Page,
    FormLayout,
    TextField,
    Form,
    Button,
    Banner,
} from "@shopify/polaris";
import {useCallback, useState} from "react";
import {useMutation} from "@apollo/client";
import {Loading, TitleBar, useClientRouting, useRoutePropagation} from "@shopify/app-bridge-react";
import {useLocation, useNavigate} from "react-router-dom";
import {CREATE_PRODUCT} from "../graphql/queries.js";


export function ProductCreateForm() {
    // Route Propagator and Client Routing
    let location = useLocation();
    let navigate = useNavigate();
    useRoutePropagation(location);
    useClientRouting({
        replace(path) {
            navigate(path);
        }
    });

    // Mutation
    const [productCreate, {loading, error}] = useMutation(CREATE_PRODUCT);

    // States
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    // Handlers
    const handleTitleChange = useCallback((value) => setTitle(value), []);
    const handleDescriptionChange = useCallback((value) => setDescription(value), []);
    const handleSubmit = useCallback(() => {
        if (title && title.trim()) {
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

    // Error banner
    if (error) {
        console.warn(error);
        return (
            <Banner status="critical">There was an issue loading product.</Banner>
        );
    }


    return (
        <Page title='Create product'>
            <TitleBar
                title="Create product"
                primaryAction={null}
            />
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
