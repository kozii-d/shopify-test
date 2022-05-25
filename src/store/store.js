import {applyMiddleware, combineReducers, createStore} from "@reduxjs/toolkit";
import axiosMiddleware from "redux-axios-middleware";
import axios from "axios";
import {getSessionToken} from "@shopify/app-bridge-utils";
import productCount from './productCount/reducer'
import {Redirect} from "@shopify/app-bridge/actions";

const rootReducer = combineReducers({
    productCount
})

const client = axios.create();
client.interceptors.request.use(function (config) {
    return getSessionToken(window.app)
        .then((token) => {
            config.headers["Authorization"] = `Bearer ${token}`;
            return config;
        });
});
client.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        if (
            error.response.headers["x-shopify-api-request-failure-reauthorize"] === "1"
        ) {
            const authUrlHeader = error.response.headers["x-shopify-api-request-failure-reauthorize-url"];
            const redirect = Redirect.create(window.app);
            redirect.dispatch(Redirect.Action.REMOTE, authUrlHeader || `/auth`);
            return null;
        }

        return error;
    });

export const store = createStore(rootReducer, applyMiddleware(
        axiosMiddleware(client),
    )
);