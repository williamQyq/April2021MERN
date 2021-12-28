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

export const getWmsProdQty = async (prods) => {
    const prodQty = prods.map(prod => {
        prod.wmsQuantity = axios.get('/api/wms', { upc: prod.upc }).then(res => res.data)
        return prod;
    })

    return prodQty;
}

// get Product Pricing from Amazon SP
// const callProductPricingAPI = asins => (
//     axios.post('/api/amazonSP/prod_pricing', { asins })
//         .then(res => res.data)
// )

const setAmazonResLoading = () => {
    return {
        type: AMAZON_RES_LOADING
    };
}