import {useEffect, useState} from "react";
import {
    Card,
    Heading,
    TextContainer,
    DisplayText,
    TextStyle,
    Button,
    Page,
    Layout
} from "@shopify/polaris";
import {TitleBar, Toast, useAppBridge, useClientRouting, useRoutePropagation} from "@shopify/app-bridge-react";
import {useMutation} from "@apollo/client";

import {userLoggedInFetch} from "../App";
import {useLocation, useNavigate} from "react-router-dom";
import {PRODUCTS_QUERY} from "../graphql/queries.js";


export function ProductsCard() {
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
    const [populateProduct, {loading}] = useMutation(PRODUCTS_QUERY);

    // States
    const [productCount, setProductCount] = useState(0);
    const [hasResults, setHasResults] = useState(false);

    const app = useAppBridge();
    const fetch = userLoggedInFetch(app);

    async function updateProductCount() {
        const {count} = await fetch("/products/count").then((res) => res.json());
        setProductCount(count);
    }

    useEffect(() => {
        updateProductCount();
    }, []);

    const toastMarkup = hasResults && (
        <Toast
            content="5 products created!"
            onDismiss={() => setHasResults(false)}
        />
    );

    return (
        <Page title='Generate 5 random products'>
            <TitleBar
                title="Generator"
                primaryAction={null}
            />
            <Layout>
                <Layout.Section>
                    {toastMarkup}
                    <Card title="Product Counter" sectioned>
                        <TextContainer spacing="loose">
                            <p>
                                Sample products are created with a default title and price. You can
                                remove them at any time.
                            </p>
                            <Heading element="h4">
                                TOTAL PRODUCTS
                                <DisplayText size="medium">
                                    <TextStyle variation="strong">{productCount}</TextStyle>
                                </DisplayText>
                            </Heading>
                            <Button
                                primary
                                loading={loading}
                                onClick={() => {
                                    Promise.all(
                                        Array.from({length: 5}).map(() =>
                                            populateProduct({
                                                variables: {
                                                    input: {
                                                        title: randomTitle(),
                                                    },
                                                },
                                            })
                                        )
                                    ).then(() => {
                                        updateProductCount();
                                        setHasResults(true);
                                    });
                                }}
                            >
                                Populate 5 products
                            </Button>
                        </TextContainer>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}

function randomTitle() {
    const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];

    return `${adjective} ${noun}`;
}

const ADJECTIVES = [
    "autumn",
    "hidden",
    "bitter",
    "misty",
    "silent",
    "empty",
    "dry",
    "dark",
    "summer",
    "icy",
    "delicate",
    "quiet",
    "white",
    "cool",
    "spring",
    "winter",
    "patient",
    "twilight",
    "dawn",
    "crimson",
    "wispy",
    "weathered",
    "blue",
    "billowing",
    "broken",
    "cold",
    "damp",
    "falling",
    "frosty",
    "green",
    "long",
    "late",
    "lingering",
    "bold",
    "little",
    "morning",
    "muddy",
    "old",
    "red",
    "rough",
    "still",
    "small",
    "sparkling",
    "throbbing",
    "shy",
    "wandering",
    "withered",
    "wild",
    "black",
    "young",
    "holy",
    "solitary",
    "fragrant",
    "aged",
    "snowy",
    "proud",
    "floral",
    "restless",
    "divine",
    "polished",
    "ancient",
    "purple",
    "lively",
    "nameless",
];

const NOUNS = [
    "waterfall",
    "river",
    "breeze",
    "moon",
    "rain",
    "wind",
    "sea",
    "morning",
    "snow",
    "lake",
    "sunset",
    "pine",
    "shadow",
    "leaf",
    "dawn",
    "glitter",
    "forest",
    "hill",
    "cloud",
    "meadow",
    "sun",
    "glade",
    "bird",
    "brook",
    "butterfly",
    "bush",
    "dew",
    "dust",
    "field",
    "fire",
    "flower",
    "firefly",
    "feather",
    "grass",
    "haze",
    "mountain",
    "night",
    "pond",
    "darkness",
    "snowflake",
    "silence",
    "sound",
    "sky",
    "shape",
    "surf",
    "thunder",
    "violet",
    "water",
    "wildflower",
    "wave",
    "water",
    "resonance",
    "sun",
    "wood",
    "dream",
    "cherry",
    "tree",
    "fog",
    "frost",
    "voice",
    "paper",
    "frog",
    "smoke",
    "star",
];
