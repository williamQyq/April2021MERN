import {combineReducers } from 'redux';
import itemReducer from './itemReducer';
import itemBBReducer from './itemBBReducer';

export default combineReducers({
    item: itemReducer,
    bb_item: itemBBReducer
    
})