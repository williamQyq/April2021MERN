import axios from 'axios';
import Moment from 'moment';
import { GET_KEEPA_STAT, KEEPA_LOADING, KEEPA_LOADED } from './types';

export const getKeepaStat = () => dispatch => {
    dispatch(setKeepaLoading());
    axios.get('/api/keepa').then(res => {

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

export const setKeepaLoading = () => {
    return {
        type: KEEPA_LOADING
    };
};

// export const getItemDetail = (_id) => dispatch => {
//     dispatch(setItemsLoading());
//     axios.get(`/api/bb_items/detail/${_id}`).then(res => {
//         let item = Object.values(res.data).pop();
//         // console.log(` Action called: \n${JSON.stringify(item)}`);
//         item.price_timestamps.forEach(ts => {
//             ts.date = Moment(ts.date).format("MMM Do YYYY HH:mm a");
//         });

//         dispatch({
//             type: GET_BB_ITEM_DETAIL,
//             payload: item
//         })
//     })
// };