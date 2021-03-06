import React, {useMemo} from 'react';
import {NavigationMenu, useClientRouting, useRoutePropagation} from "@shopify/app-bridge-react";
import {useLocation, useNavigate} from "react-router-dom";

export function AppNavigation() {
    // Route Propagator and Client Routing
    let location = useLocation();
    let navigate = useNavigate();
    useRoutePropagation(location);
    useClientRouting({
        replace(path) {
            navigate(path);
        }
    });

    // Navigation links
    const homeLink = useMemo(() => ({
        label: 'Home',
        destination: '/',
    }), []);
    const productsLink = useMemo(() => ({
        label: 'Products',
        destination: '/products',
    }), []);
    const productFormLink = useMemo(() => ({
        label: 'Create product',
        destination: '/product-create',
    }), []);
    const generatorLink = useMemo(() => ({
        label: 'Product Generator',
        destination: '/generator',
    }), []);

    return <NavigationMenu
        navigationLinks={[homeLink, productsLink, productFormLink, generatorLink]}
    />;
}