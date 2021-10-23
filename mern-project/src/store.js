import { createStore, applyMiddleware, compose } from 'redux';
import { createStateSyncMiddleware, initMessageListener } from 'redux-state-sync';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: "root",
    storage,
}
const persistedReducer = persistReducer(persistConfig, rootReducer);

const initialState = {};
const middleware = [thunk, createStateSyncMiddleware({
    blacklist: ["persist/PERSIST", "persist/REHYDRATE"],
})
];

const store = createStore(persistedReducer, initialState, compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__
        ? window.__REDUX_DEVTOOLS_EXTENSION__()
        : f => f
));

initMessageListener(store);
export default store;