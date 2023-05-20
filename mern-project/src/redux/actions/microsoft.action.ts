import axios from 'axios';
import Moment from 'moment';
import { GET_MS_ITEMS, ITEMS_LOADING_MS } from './types';
import { tokenConfig } from './authActions';
import { ThunkAction, AnyAction } from '@reduxjs/toolkit';
import { RootState } from '../store/store';
import { AppDispatch, DealsDataSourceType } from '../interface';

export const getMicrosoftDeals = (): ThunkAction<void, RootState, any, AnyAction> =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
        dispatch(setItemsLoading());
        axios.get<DealsDataSourceType>('/api/microsoft/v1/deals', tokenConfig(getState))
            .then(res => {
                //modify created date time format in res.data
                let deals = Object.values(res.data).map(item => {
                    item.captureDate = Moment(item.captureDate).format("MM-DD-YYYY HH:mm:ss");
                    return item
                })
                dispatch({
                    type: GET_MS_ITEMS,
                    payload: deals
                })
            })
    };

export const setItemsLoading = () => {
    return {
        type: ITEMS_LOADING_MS
    };
};