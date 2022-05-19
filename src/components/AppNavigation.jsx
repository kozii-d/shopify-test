import React from 'react';
import {useAppBridge} from "@shopify/app-bridge-react";
import {AppLink, NavigationMenu} from "@shopify/app-bridge/actions";

export function AppNavigation({active}) {
    const app = useAppBridge();

    const homeLink = AppLink.create(app, {
        label: 'Home',
        destination: '/',
    });
    const productsLink = AppLink.create(app, {
        label: 'Products',
        destination: '/products',
    });
    const productFormLink = AppLink.create(app, {
        label: 'Create product',
        destination: '/product-create',
    });
    const generatorLink = AppLink.create(app, {
        label: 'Product Generator',
        destination: '/generator',
    });
    const navigationMenu = NavigationMenu.create(app, {
        items: [homeLink, productsLink, productFormLink, generatorLink],
        active: homeLink,
    });

    return null;
}