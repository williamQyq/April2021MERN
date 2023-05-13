import axios, { AxiosRequestConfig } from "axios";
import { MyThunkAction } from "@src/redux/interface.js";
import { RootState } from "@src/redux/store/store";
import { AnyAction, Dispatch } from "redux";
import { returnErrors } from './errorActions'

import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGOUT_SUCCESS,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    REGISTER_FAIL,
} from "./types.js";

export const tokenConfig = (getState: () => RootState) => {
    // Get token from localStorage
    const { token, isOAuth } = getState().auth;

    //Headers
    const config: AxiosRequestConfig & { headers: { 'x-auth-token': any, 'Authorization': any } } = {
        // headers: {
        //     "Content-type": "application/json"
        // },
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": undefined,
            "Authorization": undefined
        },
        timeout: 30000
    };

    if (token && isOAuth) {
        config.headers["Authorization"] = "Bearer" + token;
    } else if (token) {
        config.headers['x-auth-token'] = token;

    }
    return config;
}

/**
 * 
 * @param authConfig
 * @returns dispatch payload to redux auth reducer
 * @description for legacy email psw login 
 */
export const login = (authConfig: { username: string, password: string }) => async (dispatch: Dispatch<AnyAction>) => {
    const { username, password } = authConfig;
    //Headers
    const config: AxiosRequestConfig = {
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
            dispatch(
                returnErrors(err.response.data.msg, err.response.status, LOGIN_FAIL)
            );
        })
}

// async function getUserAuthToken() {
//     return axios.get('/api/auth/token')
//         .then(res => {
//             console.log(`get auth token: `, res.data)
//             return res.data;
//         })
// }

//Check token & load user
export const loadUser = (): MyThunkAction => (dispatch: Dispatch<AnyAction>) => {
    dispatch({ type: USER_LOADING });
    const config: AxiosRequestConfig = {
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        }
    }
    axios.get('/api/auth/user', config)
        .then(res =>
            dispatch({
                type: USER_LOADED,
                payload: res.data
            })
        )
        .catch(err => {
            // dispatch(returnErrors(err.response.data.msg, err.response.status));
            dispatch({
                type: AUTH_ERROR
            });
        });

}

// Logout User
export const logout = () => (dispatch: Dispatch<AnyAction>) => {
    dispatch({
        type: LOGOUT_SUCCESS
    })
}

export const register = () => (dispatch: Dispatch<AnyAction>) => {
    dispatch(
        returnErrors("Currently, registration is not yet open to public.", 202, REGISTER_FAIL)
    )
}

