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
        getWmsProdQty(res.data).then(data => {
            dispatch({
                type: GET_AMZ_PROD_PRICING,
                payload: data
            })
        });
    })

}

export const getWmsProdQty = async (prods) => {
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    };

    const upcs = prods.map(prod => prod.upc)

    let res = await axios.post(`/api/wms/quantity/all`, { upcs }, config)
    let prodsQtyMap = new Map(res.data)
    prods.forEach(prod => {
        prod.wmsQuantity = prodsQtyMap.get(prod.upc)
    });

    return prods;
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