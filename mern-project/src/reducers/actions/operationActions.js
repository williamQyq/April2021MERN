import axios from 'axios';
import Papa from "papaparse";
import {
    GET_AMZ_PROD_PRICING,
    RES_LOADING,
    UPLOAD_ASINS_MAPPING,
    // GET_ERRORS,
} from './types';

// GET Upc Asins Mapping Record from db, then get asin pricing info via SP API,
// then get upc quantity info from wms. Finally, dispatch product pricing data.
export const getProductPricing = () => dispatch => {
    dispatch(setResLoading());
    axios.get('/api/operation').then(res => {
        getWmsProdQty(res.data).then(result => {
            dispatch({
                type: GET_AMZ_PROD_PRICING,
                payload: result
            })
        });
    })

}

export const getWmsProdQty = prods => {
    return Promise.all(
        prods.map(async (prod) => {
            await axios.get(`/api/wms/quantity/${prod.upc}`)
                .then(res => { prod.wmsQuantity = res.data })
            return prod;
        })
    )
}

export const uploadAsinsMapping = (file) => dispatch => {
    dispatch(setResLoading());
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            complete: (results) => {
                const uploadFile = results.data;
                axios.post('/api/operation/upload/asins-mapping', { uploadFile })
                    .then(res => {
                        dispatch({
                            type: UPLOAD_ASINS_MAPPING,
                            payload: res.data
                        })
                        resolve(res)
                    })
            },
            error: err => {
                reject(err)
            }
        })
    })
}

const setResLoading = () => {
    return {
        type: RES_LOADING
    };
}