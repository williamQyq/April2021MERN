import { message } from 'antd';
import axios from 'axios';
import Moment from 'moment';
import { returnErrors } from './errorActions'
import {
    GET_BB_ITEMS,
    GET_BB_ITEM_DETAIL,
    ITEMS_LOADING,
    GET_ITEM_SPEC,
    ADD_ITEM_SPEC,
    SET_TABLE_STATE,
    GET_ERRORS,
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

export const setTableSettings = (store, clickedId) => dispatch => {
    dispatch(setItemsLoading());

    dispatch({
        type: SET_TABLE_STATE,
        payload: {
            store,
            clickedId
        }
    })
}

export const addItemSpec = (record) => dispatch => {
    dispatch(setItemsLoading);
    const config = { headers: { 'Content-Type': 'application/json' } }
    axios.put('/api/bb_items/itemSpec/add', record, config)
        .then(res => {
            if (res.data.status === "success") {
                dispatch({
                    type: ADD_ITEM_SPEC,
                    payload: res.data
                })
                message.success(res.data.msg)
            } else {
                message.warn(res.data.msg)
                dispatch(returnErrors(res.data.msg, res.data.status))
            }
        }).catch(e => {
            message.warn("addItemSpec failed.")
            dispatch(returnErrors("addItemSpec failed.", "error"))
        })
}