import axios from 'axios';
import { tokenConfig } from './authActions.js';
import { returnErrors } from './errorActions.js';
import { INVENTORY_RECEIVED_LOADING, SYNC_INVENTORY_RECEIVED_WITH_GSHEET } from './types.js';

export const syncInventoryReceivedWithGsheet = () => (dispatch, getState) => {
    axios.get(`/api/wms/inventoryReceived/syncGsheet`, tokenConfig(getState))
        .then((res) => {
            dispatch(setInventoryReceivedLoading())
            dispatch({
                type: SYNC_INVENTORY_RECEIVED_WITH_GSHEET,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data.msg, err.response.status))
        })
}

const setInventoryReceivedLoading = () => {
    return {
        type: INVENTORY_RECEIVED_LOADING
    }
}