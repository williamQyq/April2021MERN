import { combineReducers } from 'redux';
import itemReducer from './itemReducer';
import itemBBReducer from './itemBBReducer';
import itemMSReducer from './itemMSReducer';
import itemWMReducer from './itemWMReducer'
// import itemCCReducer from './itemCCReducer';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import keepaReducer from './keepaReducer';
import operationReducer from './operationReducer';

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
    walmart:itemWMReducer,
    error: errorReducer,
    auth: authReducer,
    keepa: keepaReducer,
    amazon: operationReducer,

})

export default rootReducer;