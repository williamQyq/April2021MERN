import axios, { AxiosRequestConfig } from "axios";
import { MyThunkAction } from "reducers/interface.js";
import { RootState } from "reducers/store/store.js";
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

export const tokenConfig = <State extends RootState>(getState: () => State) => {
    // Get token from localStorage
    const token = getState().auth.token;

    //Headers
    const config: AxiosRequestConfig & { headers: { 'x-auth-token': any } } = {
        // headers: {
        //     "Content-type": "application/json"
        // },
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": undefined
        },
        timeout: 30000
    };

    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
}



export const login = (authObject: { username: string, password: string }) => async (dispatch: Dispatch<AnyAction>) => {
    const { username, password } = authObject;
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


//Check token & load user
export const loadUser = (): MyThunkAction => (dispatch, getState) => {
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



export const googleOAuthLogin = () => async (dispatch: Dispatch<AnyAction>) => {
    window.open("http://localhost:5000/api/auth/google", "_self")
}

