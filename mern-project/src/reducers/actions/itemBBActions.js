import axios from 'axios';
import Moment from 'moment';
import { GET_BB_ITEMS, ITEMS_BB_LOADING } from './types';

export const getBBItems = () => dispatch => {
    dispatch(setItemsLoading());
    axios.get('/api/bb_items').then(res => {

        //modify created date time format in res.data
        const items = Object.values(res.data);         
        items.map(item => {
            item.created_date = Moment(item.created_date).format("MM-DD-YYYY HH:mm:ss");
            return item
        })
        dispatch({
            type: GET_BB_ITEMS,
            payload: items
        })
    }
    )
};

export const setItemsLoading = () => {
    return {
        type: ITEMS_BB_LOADING
    };
};
