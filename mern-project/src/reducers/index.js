import { combineReducers } from 'redux';
import itemReducer from './itemReducer';
import itemBBReducer from './itemBBReducer';
import itemMSReducer from './itemMSReducer';
// import itemCCReducer from './itemCCReducer';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import keepaReducer from './keepaReducer';
import amazonReducer from './amazonReducer';

import storage from 'redux-persist/lib/storage';

import { LOGOUT_SUCCESS } from './actions/types';

const rootReducer = (state, action) => {
    switch (action.type) {
        case LOGOUT_SUCCESS:
            storage.removeItem('persist:root');
            return appReducers(undefined, action)
        default:
            return appReducers(state, action)
    }
}

const appReducers = combineReducers({
    item: itemReducer,
    bestbuy: itemBBReducer,
    microsoft: itemMSReducer,
    error: errorReducer,
    auth: authReducer,
    keepa: keepaReducer,
    amazon: amazonReducer,

})

export default rootReducer;