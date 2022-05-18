import {
    Page,
    Layout,
    Card, TextContainer, Heading, DisplayText,
} from "@shopify/polaris";
import {useEffect, useState} from "react";
import {useAppBridge} from "@shopify/app-bridge-react";
import {userLoggedInFetch} from "../App.jsx";


export function HomePage() {
    const [productCount, setProductCount] = useState(0);

    const app = useAppBridge();
    const fetch = userLoggedInFetch(app);

    async function updateProductCount() {
        const {count} = await fetch("/products/count").then((res) => res.json());
        setProductCount(count);
    }

    useEffect(updateProductCount, []);

    return (
        <Page title='Product Counter' fullWidth>
            <Layout>
                <Layout.Section secondary>
                    <Card title='All products' sectioned>
                        <TextContainer>
                            <Heading element='h2'>Total number of products: {<DisplayText>{productCount}</DisplayText>}</Heading>
                        </TextContainer>
                    </Card>
                </Layout.Section>
                <Layout.Section secondary>
                    <Card title='Published products' sectioned>
                        <TextContainer>
                            <Heading element='h2'>Number of published products: {<DisplayText>{productCount}</DisplayText>}</Heading>
                        </TextContainer>
                    </Card>
                </Layout.Section>
                <Layout.Section secondary>
                    <Card title='Unpublished products' sectioned>
                        <TextContainer>
                            <Heading element='h2'>Number of unpublished products: {<DisplayText>{productCount}</DisplayText>}</Heading>
                        </TextContainer>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}
