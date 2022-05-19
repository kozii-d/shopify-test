import {
    Page,
    Layout,
    Card, TextContainer, Heading, DisplayText,
} from "@shopify/polaris";
import {useEffect} from "react";
import {useClientRouting, useRoutePropagation} from "@shopify/app-bridge-react";
import {useLocation, useNavigate} from "react-router-dom";


export function HomePage({totalProductCount, publishedProductCount, unpublishedProductCount, getTotalProductCount, getPublishedProductCount, getUnpublishedProductCount}) {
    // Route Propagator and Client Routing
    let location = useLocation();
    let navigate = useNavigate();
    useRoutePropagation(location);
    useClientRouting({
        replace(path) {
            navigate(path);
        }
    });


    useEffect(() => {
        getTotalProductCount();
        getPublishedProductCount();
        getUnpublishedProductCount();
    }, []);

    return (
        <Page title='Product Counter' fullWidth>
            <Layout>
                <Layout.Section secondary>
                    <Card title='All products' sectioned>
                        <TextContainer>
                            <Heading element='h2'>Total number of products: {<DisplayText>{totalProductCount}</DisplayText>}</Heading>
                        </TextContainer>
                    </Card>
                </Layout.Section>
                <Layout.Section secondary>
                    <Card title='Published products' sectioned>
                        <TextContainer>
                            <Heading element='h2'>Number of published products: {<DisplayText>{publishedProductCount}</DisplayText>}</Heading>
                        </TextContainer>
                    </Card>
                </Layout.Section>
                <Layout.Section secondary>
                    <Card title='Unpublished products' sectioned>
                        <TextContainer>
                            <Heading element='h2'>Number of unpublished products: {<DisplayText>{unpublishedProductCount}</DisplayText>}</Heading>
                        </TextContainer>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}
