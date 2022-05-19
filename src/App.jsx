import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import {
  Provider as AppBridgeProvider, TitleBar,
  useAppBridge,
} from "@shopify/app-bridge-react";
import {authenticatedFetch} from "@shopify/app-bridge-utils";
import {Redirect} from "@shopify/app-bridge/actions";
import { AppProvider as PolarisProvider } from "@shopify/polaris";
import translations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";

import HomePage from "./components/HomePage/index.js";
import {Routes, Route, BrowserRouter} from "react-router-dom";
import {ProductsList} from "./components/ProductList";
import {ProductCreateForm} from "./components/ProductCreateForm.jsx";
import {ProductsCard} from "./components/ProductsCard";
import {ProductUpdateForm} from "./components/ProductUpdateForm.jsx";
import {AppNavigation} from "./components/AppNavigation.jsx";

export default function App() {
  const primaryAction = {content: 'Foo', url: '/foo'};
  const secondaryActions = [{content: 'Bar', url: '/bar', loading: true}];
  const actionGroups = [{title: 'Baz', actions: [{content: 'Baz', url: '/baz'}]}];

  return (
      <BrowserRouter>
        <PolarisProvider i18n={translations}>
          <AppBridgeProvider
              config={{
                apiKey: process.env.SHOPIFY_API_KEY,
                host: new URL(location).searchParams.get("host"),
                forceRedirect: true,
              }}
          >
            <MyProvider>
              <TitleBar
                  title="Hello world!"
                  primaryAction={primaryAction}
                  secondaryActions={secondaryActions}
                  actionGroups={actionGroups}
              />
              <Routes>
                <Route path='/' element={<HomePage />}></Route>
                <Route path='/product-list' element={<ProductsList />}></Route>
                <Route path='/product-create' element={<ProductCreateForm />}></Route>
                <Route path='/product-update/:id' element={<ProductUpdateForm />}></Route>
                <Route path='/generator' element={<ProductsCard />}></Route>
                <Route path='/*' element={<ProductsList />}></Route>
              </Routes>
            </MyProvider>
          </AppBridgeProvider>
        </PolarisProvider>
      </BrowserRouter>
  );
}

function MyProvider({ children }) {
  const app = useAppBridge();

  const defaultOptions = {
    watchQuery: {
      fetchPolicy: 'no-cache',
      nextFetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      nextFetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  }

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      credentials: "include",
      fetch: userLoggedInFetch(app),
      defaultOptions: defaultOptions,
    }),
  });

  return <>
    <AppNavigation/>
    <ApolloProvider client={client}>{children}</ApolloProvider>;

  </>

}

export function userLoggedInFetch(app) {
  const fetchFunction = authenticatedFetch(app);

  return async (uri, options) => {
    const response = await fetchFunction(uri, options);

    if (
      response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1"
    ) {
      const authUrlHeader = response.headers.get(
        "X-Shopify-API-Request-Failure-Reauthorize-Url"
      );

      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth`);
      return null;
    }

    return response;
  };
}
