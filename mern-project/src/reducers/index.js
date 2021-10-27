import {combineReducers } from 'redux';
import itemReducer from './itemReducer';
import itemBBReducer from './itemBBReducer';
import itemCCReducer from './itemCCReducer';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
export default combineReducers({
    item: itemReducer,
    itemBB: itemBBReducer,
    error: errorReducer,
    auth: authReducer
    
})