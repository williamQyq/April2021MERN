import axios from 'axios';
import Moment from 'moment';
import {
    GET_AMZ_PROD_PRICING,
    AMAZON_RES_LOADING,
    GET_ERRORS,
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

const setAmazonResLoading = () => {
    return {
        type: AMAZON_RES_LOADING
    };
}