import axios from 'axios';
import Moment from 'moment';
import {
    GET_AMZ_PROD_PRICING,
    AMAZON_RES_LOADING
} from './types';

export const getProductPricing = (asins) => dispatch => {
    dispatch(setAmazonResLoading());
    axios.post('/api/amazonSP/productPricing', { asins }).then(res => {
        dispatch({
            type: GET_AMZ_PROD_PRICING,
            payload: res.data
        })
    }
    )
}

const setAmazonResLoading = () => {
    return {
        type: AMAZON_RES_LOADING
    };
}

// export const getItems = () => dispatch => {
//     dispatch(setItemsLoading());
//     axios.get('/api/items').then(res =>
//         dispatch({
//             type: GET_ITEMS,
//             payload: res.data
//         })
//     )
// };
