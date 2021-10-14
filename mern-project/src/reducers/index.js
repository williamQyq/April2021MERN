import {combineReducers } from 'redux';
import itemReducer from './itemReducer';
import itemBBReducer from './itemBBReducer';
import itemCCReducer from './itemCCReducer';

export default combineReducers({
    item: itemReducer,
    bb_item: itemBBReducer,
    cc_item: itemCCReducer
    
})