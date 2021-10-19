import axios from 'axios';
import Moment from 'moment';
import { GET_BB_ITEMS, GET_BB_ITEM_DETAIL, ITEMS_LOADING } from './types';

export const getBBItems = () => dispatch => {
    dispatch(setItemsLoading());
    axios.get('/api/bb_items').then(res => {

        //modify created date time format in res.data
        let items = Object.values(res.data);     
        items.map(item => {
            item.captureDate = Moment(item.captureDate).format("MM-DD-YYYY HH:mm:ss");
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
        type: ITEMS_LOADING
    };
};

export const getItemDetail = (_id) => dispatch => {
    dispatch(setItemsLoading());
    axios.get(`/api/bb_items/detail/${_id}`).then(res => {
        // let item = Object.values(res.data);
        // console.log(` Action: \n${item}`);
        // // item.price_timestamps.map(ts => {
        // //     ts.date = Moment(ts.date).format("MM-DD-YYYY HH:mm");
        // //     return ts
        // // })
        
        dispatch({
            type: GET_BB_ITEM_DETAIL,
            payload: res.data
        })
    })
};
