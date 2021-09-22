import axios from 'axios';
import {GET_BB_ITEMS, ITEMS_BB_LOADING} from './types';

export const getBBItems = () => dispatch => {
    dispatch(setItemsLoading());
    axios.get('/api/bb_items').then(res => 
            dispatch({
                type: GET_BB_ITEMS,
                payload: res.data
            })
        )
};

export const setItemsLoading = () => {
    return {
        type: ITEMS_BB_LOADING
    };
};
