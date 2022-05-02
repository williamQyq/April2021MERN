import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
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
            dispatch(returnErrors(err.response.data, err.response.status));
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
        }
    };

    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
}

export const login = ({ email, password }) => dispatch => {
    //Headers
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    };

    const body = JSON.stringify({ email, password });

    axios.post('/api/auth', body, config)
        .then(res =>
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            })
        )
        .catch(err => {
            dispatch(
                returnErrors(err.response.data, err.response.status, LOGIN_FAIL)
            );
            dispatch({
                type: LOGIN_FAIL
            });
        })
}

// Logout User
export const logout = () => {
    return {
        type: LOGOUT_SUCCESS
    };
}