import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
    REGISTER_FAIL,
    REGISTER_SUCCESS
} from "./actions/types.js";
import { returnErrors } from './errorActions'
import axios from "axios";

//Check token & load user
export const loadUser = () => (dispatch, getState) => {
    dispatch({ type: USER_LOADING });

    // Get token from localStorage
    const token = getState().auth.token;

    //Headers
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }
    if (token) {
        config.headers['x-auth-token'] = token;
    }

    axios.get('/api/auth/user', config)
        .then(res => dispatch({
            type: USER_LOADING,
            payload: res.data
        }))
        .catch(err => {
            dispatch({
                type: AUTH_ERROR
            });
        })

}