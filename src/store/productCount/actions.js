import {createAction} from "redux-actions";

const createRequestAction = (type, payloadCreator) => {
    const action = createAction(type, payloadCreator);
    action.success = type + '_SUCCESS';
    action.fail = type + '_FAIL';
    return action;
}

export const getTotalProductCount = createRequestAction('GET_TOTAL_PRODUCT_COUNT', () => ({
    request: {
        method: 'post',
        url: '/rest',
        data: {url: 'https://kozii-d.myshopify.com/admin/api/2022-04/products/count.json'}
    }
}))

export const getPublishedProductCount = createRequestAction('GET_PUBLISHED_PRODUCT_COUNT', () => ({
    request: {
        method: 'post',
        url: '/rest',
        data: {url: 'https://kozii-d.myshopify.com/admin/api/2022-04/products/count.json?published_status=published'}
    }
}))
export const getUnpublishedProductCount = createRequestAction('GET_UNPUBLISHED_PRODUCT_COUNT', () => ({
    request: {
        method: 'post',
        url: '/rest',
        data: {url: 'https://kozii-d.myshopify.com/admin/api/2022-04/products/count.json?published_status=unpublished'}
    }
}))