import {
    Page,
    Layout,
} from "@shopify/polaris";

import {ProductsCard} from "./ProductsCard";
import {ProductsList} from "./ProductList";

export function HomePage() {
    return (
        <Page fullWidth>
            <Layout>
                <Layout.Section>
                    <ProductsList/>
                </Layout.Section>
                <Layout.Section secondary>
                    <ProductsCard/>
                </Layout.Section>
            </Layout>
        </Page>
    );
}
