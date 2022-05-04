import axios from 'axios';
import { tokenConfig } from './authActions.js';

export const getInvReceive = () => (dispatch, getState) => (
    axios.get(`/api/inbound/inv-receive/wrongadds`, tokenConfig(getState))
        .then(result => {
            return result
        })
)
