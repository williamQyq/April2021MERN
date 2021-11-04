import { combineReducers } from 'redux';
import itemReducer from './itemReducer';
import itemBBReducer from './itemBBReducer';
// import itemCCReducer from './itemCCReducer';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import keepaReducer from './keepaReducer';
import { LOGOUT_SUCCESS } from './actions/types';
import storage from 'redux-persist/lib/storage';

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
    itemBB: itemBBReducer,
    error: errorReducer,
    auth: authReducer,
    keepa: keepaReducer

})

export default rootReducer;