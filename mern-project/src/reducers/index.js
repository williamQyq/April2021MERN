import { combineReducers } from 'redux';
import itemReducer from './itemReducer.js';
import itemBBReducer from './itemBBReducer.js';
import itemMSReducer from './itemMSReducer.js';
import itemWMReducer from './itemWMReducer.js';
// import itemCCReducer from './itemCCReducer';
import errorReducer from './errorReducer.js';
import authReducer from './authReducer.js';
import keepaReducer from './keepaReducer.js';
import operationReducer from './operationReducer.js';
import warehouseReducer from './warehouseReducer.js';

import storage from 'redux-persist/lib/storage';

import { LOGOUT_SUCCESS } from './actions/types.js';

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
    walmart: itemWMReducer,
    error: errorReducer,
    auth: authReducer,
    keepa: keepaReducer,
    amazon: operationReducer,
    warehouse: warehouseReducer,

})

export default rootReducer;