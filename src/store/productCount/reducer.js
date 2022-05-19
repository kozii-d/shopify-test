import {handleActions} from "redux-actions";
import {getTotalProductCount, getPublishedProductCount, getUnpublishedProductCount} from "./actions.js";

const defaultState = {
    totalProductCount: 0,
    publishedProductCount: 0,
    unpublishedProductCount: 0,
};

const handleUpdateTotalProductCount = (state, {payload}) => {
    return {...state, totalProductCount: payload.data.count};
}

const handleUpdatePublishedProductCount = (state, {payload}) => {
    return {...state, publishedProductCount: payload.data.count};
}

const handleUpdateUnpublishedProductCount = (state, {payload}) => {
    return {...state, unpublishedProductCount: payload.data.count};
}


const handleUpdateProductCountError = (state, {payload}) => {
    return {...state, totalProductCount: payload.data.count};
}

export default handleActions({
    [getTotalProductCount.success]: handleUpdateTotalProductCount,
    [getTotalProductCount.fail]: handleUpdateProductCountError,

    [getPublishedProductCount.success]: handleUpdatePublishedProductCount,
    [getPublishedProductCount.fail]: handleUpdateProductCountError,

    [getUnpublishedProductCount.success]: handleUpdateUnpublishedProductCount,
    [getUnpublishedProductCount.fail]: handleUpdateProductCountError,
}, defaultState);