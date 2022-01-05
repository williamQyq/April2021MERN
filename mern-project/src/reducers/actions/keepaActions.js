import axios from 'axios';
import { GET_KEEPA_STAT, KEEPA_LOADING } from './types';

export const getKeepaStat = (searchTerm) => dispatch => {
    dispatch(setKeepaLoading);
    axios.get('/api/keepa',{ params:{searchTerm}}).then(res =>
        dispatch({
            type: GET_KEEPA_STAT,
            payload: res.data
        })
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