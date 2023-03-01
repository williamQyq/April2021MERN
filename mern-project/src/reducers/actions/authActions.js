import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
    REGISTER_FAIL,
    // REGISTER_FAIL,
    // REGISTER_SUCCESS
} from "./types.js";
import { returnErrors } from './errorActions'
import axios from "axios";

//Check token & load user
export const loadUser = () => (dispatch, getState) => {
    dispatch({ type: USER_LOADING });
    axios.get('/api/auth/user', tokenConfig(getState))
        .then(res => dispatch({
            type: USER_LOADED,
            payload: res.data
        }))
        .catch(err => {
            // dispatch(returnErrors(err.response.data.msg, err.response.status));
            dispatch({
                type: AUTH_ERROR
            });
        });

}

export const tokenConfig = getState => {
    // Get token from localStorage
    const token = getState().auth.token;

    //Headers
    const config = {
        headers: {
            "Content-type": "application/json"
        },
        timeout: 30000
    };

    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
}

export const login = ({ username, password }) => async (dispatch) => {
    //Headers
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    };

    const body = JSON.stringify({ email: username, password });

    return axios.post('/api/auth', body, config)
        .then(res => {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            })
        })
        .catch(err => {
            console.log(`err:`, err)
            dispatch(
                returnErrors(err.response.data.msg, err.response.status, LOGIN_FAIL)
            );
            dispatch({
                type: LOGIN_FAIL
            });
        })
}

// Logout User
export const logout = () => dispatch => {
    dispatch({
        type: LOGOUT_SUCCESS
    })
}

export const register = () => dispatch => {
    dispatch(
        returnErrors("Currently, registration is not yet open to public.", 202, REGISTER_FAIL)
    )
}