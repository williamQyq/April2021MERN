import axios from 'axios';
import Papa from "papaparse";
import {
    GET_AMZ_PROD_PRICING,
    AMAZON_RES_LOADING,
    UPLOAD_ASINS_MAPPING,
    // GET_ERRORS,
} from './types';

// GET Upc Asins Mapping Record from db, then get asin pricing info via SP API,
// then get upc quantity info from wms. Finally, dispatch product pricing data.
export const getProductPricing = () => dispatch => {
    dispatch(setAmazonResLoading());
    axios.get('/api/amazonSP').then(res => {
        getWmsProdQty(res.data).then(result => {
            dispatch({
                type: GET_AMZ_PROD_PRICING,
                payload: result
            })
        });
    })

}

export const getWmsProdQty = prods => {
    return Promise.all(prods.map(async (prod) => {
        await axios.get('/api/wms/quantity', { params: { upc: prod.upc } })
            .then(res => { prod.wmsQuantity = res.data })
        return prod;
    }))
}

export const uploadAsinsMapping = (file) => dispatch => {
    // dispatch(setAmazonResLoading());
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            complete: (results) => {
                const fileJSON = results.data;
                axios.post('/api/amazonSP/upload/asins-mapping', { fileJSON })
                    .then(res => {
                        resolve('success')
                    }).catch(e => {
                        reject(e)
                    })
            },
            error: err => {
                reject(err)
            }
        })
    })
}

const setAmazonResLoading = () => {
    return {
        type: AMAZON_RES_LOADING
    };
}