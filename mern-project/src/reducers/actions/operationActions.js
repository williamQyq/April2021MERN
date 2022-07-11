import axios from 'axios';
import Papa from "papaparse";
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';
import {
    GET_AMZ_PROD_PRICING,
    UPLOAD_ASINS_MAPPING,
    PRODUCT_LIST_LOADING,
    GET_WAREHOUSE_QTY,
    RES_LOADED
    // GET_ERRORS,
} from './types';
import store from 'store.js'
import { returnMessages } from './messageActions';

// GET Upc Asins Mapping Record from db, then get asin pricing info via SP API,
// then get upc quantity info from wms. Finally, dispatch product pricing data.
export const getProductPricing = () => (dispatch, getState) => {
    dispatch(setResLoading());
    axios.get('/api/operation', tokenConfig(getState))
        .then(res => {
            //dispatch mongo atlas prod pricing collection ducuments first, then wms quantity.
            dispatch({
                type: GET_AMZ_PROD_PRICING,
                payload: res.data
            })
            return res.data
        })
        .then(prods =>
            getWmsProdQty(prods)    //append warehouse qty to prod list.
        )
        .then(warehouseData => {
            dispatch({
                type: GET_WAREHOUSE_QTY,
                payload: warehouseData
            })
        })
        .then(() => {
            dispatch(setResLoaded())  //process finished
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data.msg, err.response.status))
        })
}

export const getWmsProdQty = async (prods) => {
    let upcArr = prods.map(prod => prod.upc)
    let appendedQtyProducts = await axios.post(`/api/wms/quantity/all`, { upcArr }, tokenConfig(store.getState))
        .then(res => {
            let upcQtyMap = new Map(res.data)
            let newProdsArr = [...prods];
            newProdsArr.forEach(prod => {
                prod.wmsQuantity = upcQtyMap.get(prod.upc)
            });
            return newProdsArr
        })

    return appendedQtyProducts

}

export const uploadAsinsMapping = (file, onSuccess, onError) => dispatch => {
    dispatch(setResLoading());
    Papa.parse(file, {
        complete: (results) => {
            const uploadFile = results.data;
            axios.post('/api/operation/upload/asins-mapping', { uploadFile })
                .then(res => {
                    dispatch({
                        type: UPLOAD_ASINS_MAPPING,
                    });
                    onSuccess(res.data.msg);
                    dispatch(returnMessages(res.data.msg, res.status, UPLOAD_ASINS_MAPPING))
                })
                .catch(err => {
                    onError(err);
                })
        },
        error: err => {
            onError(err)
        }
    })
}

const setResLoading = () => {
    return {
        type: PRODUCT_LIST_LOADING
    };
}

const setResLoaded = () => {
    return {
        type: RES_LOADED
    };
}