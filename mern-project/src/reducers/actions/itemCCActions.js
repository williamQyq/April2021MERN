import axios from 'axios';
import Moment from 'moment';
import { GET_CC_ITEMS, ITEMS_LOADING } from './types';

export const getCCItems = () => dispatch => {
    dispatch(setItemsLoading());
    axios.get('/api/cc_items').then(res => {

        //modify created date time format in res.data
        const items = Object.values(res.data);         
        items.map(item => {
            item.price_date = Moment(item.price_date).format("MM-DD-YYYY HH:mm:ss");
            return item;
        })
        dispatch({
            type: GET_CC_ITEMS,
            payload: items
        })
    }
    )
};

export const setItemsLoading = () => {
    return {
        type: ITEMS_LOADING
    };
};
