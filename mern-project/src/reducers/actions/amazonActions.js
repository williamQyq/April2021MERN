import axios from 'axios';
import Moment from 'moment';
import {
    GET_AMZ_PROD_PRICING,
    GET_UPC_ASIN_MAPPING,
    AMAZON_RES_LOADING
} from './types';

export const getProductPricing = (asins) => dispatch => {
    dispatch(setAmazonResLoading());
    axios.post('/api/amazonSP/prod_pricing', { asins }).then(res => {
        dispatch({
            type: GET_AMZ_PROD_PRICING,
            payload: res.data
        })
    })
}

export const getUpcAsinMapping = () => dispatch => {
    dispatch(setAmazonResLoading());
    axios.get('/api/amazonSP').then(res => {
        let asins = [];
        res.data.forEach(prod => {
            asins.concat(prod.identifiers.map(identifier => identifier.asin))
        })

        console.log(`result${JSON.stringify(asins)}`)
        dispatch({
            type: GET_UPC_ASIN_MAPPING,
            payload: res.data
        })
    })
}

const setAmazonResLoading = () => {
    return {
        type: AMAZON_RES_LOADING
    };
}
