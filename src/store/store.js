import {applyMiddleware, combineReducers, createStore} from "@reduxjs/toolkit";
import axiosMiddleware from "redux-axios-middleware";
import axios from "axios";
import {getSessionToken} from "@shopify/app-bridge-utils";
import {createApp} from "@shopify/app-bridge";
import productCount from './productCount/reducer'

const rootReducer = combineReducers({
    productCount
})

const app = createApp({
    apiKey: process.env.SHOPIFY_API_KEY,
    host: new URL(location).searchParams.get("host"),
    forceRedirect: true,
});

const client = axios.create();
client.interceptors.request.use(function (config) {
    return getSessionToken(app)
        .then((token) => {
            config.headers["Authorization"] = `Bearer ${token}`;
            return config;
        });
});

export const store = createStore(rootReducer, applyMiddleware(
            axiosMiddleware(client),
    )
);