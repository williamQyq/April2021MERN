import axios from 'axios';
import { tokenConfig } from './authActions.js';
import { returnErrors } from './errorActions.js';

export const getInvReceive = () => (dispatch, getState) => (
    axios.get(`/api/inbound/inv-receive/wrongadds`, tokenConfig(getState))
        .then(result => {
            return result
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data.msg, err.response.status))
        })
)

export const uploadInventoryReceived = (file) => (dispatch, getState) => {

}
export const uploadNeedToShip = (file) => (dispatch, getState) => {

}