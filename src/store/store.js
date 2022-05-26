import {applyMiddleware, combineReducers, createStore} from "@reduxjs/toolkit";
import axiosMiddleware from "redux-axios-middleware";
import productCount from './productCount/reducer'
import {client} from "../axiosClient.js";

const rootReducer = combineReducers({
    productCount
})

export const store = createStore(rootReducer, applyMiddleware(
        axiosMiddleware(client),
    )
);