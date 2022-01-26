import axios from 'axios';
import Moment from 'moment';
import {
    GET_BB_ITEMS,
    GET_BB_ITEM_DETAIL,
    ITEMS_LOADING,
    SET_TABLE_STATE,
    GET_ITEM_SPEC
} from './types';

export const getBBItems = () => dispatch => {
    dispatch(setItemsLoading());
    axios.get('/api/bb_items').then(res => {

        //modify created date time format in res.data
        let items = Object.values(res.data);
        items = items.map(item => {
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

export const getBBItemDetail = (_id) => dispatch => {
    dispatch(setItemsLoading());
    axios.get(`/api/bb_items/detail/${_id}`).then(res => {
        let item = Object.values(res.data).pop();
        // console.log(` Action called: \n${JSON.stringify(item)}`);
        item.price_timestamps.forEach(ts => {
            ts.date = Moment(ts.date).format("MMM Do YYYY HH:mm a");
        });

        dispatch({
            type: GET_BB_ITEM_DETAIL,
            payload: item
        })
    })
};

export const setTableState = (clickedId) => dispatch => {
    dispatch(setItemsLoading());
    let tableState = {
        clickedId: clickedId
    }

    dispatch({
        type: SET_TABLE_STATE,
        payload: tableState
    })
}

export const getItemSpec = (record, dispatch) => {
    dispatch(setItemsLoading);
    console.log(`link:: ${record.link}`)
    axios.get('/api/bb_items/item-spec', { params: { link: record.link } }).then(res => {
        dispatch({
            type: GET_ITEM_SPEC,
            payload: res.data
        })
    })
}