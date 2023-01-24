import { applyMiddleware } from 'redux';
import { createStateSyncMiddleware, initMessageListener } from 'redux-state-sync';
import thunk from 'redux-thunk';
import rootReducer from 'reducers/index.js';
import { persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
import localforage from 'localforage';
import { composeWithDevTools } from '@reduxjs/toolkit/dist/devtoolsExtension';
import { configureStore } from '@reduxjs/toolkit';

const persistConfig = {
    key: "root",
    storage: localforage,
}
const persistedReducer = persistReducer(persistConfig, rootReducer);

const initialState = {};
const middleware = [
    thunk,
    createStateSyncMiddleware({
        blacklist: ["persist/PERSIST", "persist/REHYDRATE"],
    }),
];
const middlewareEnhancer = applyMiddleware(...middleware);
const enhancers = [middlewareEnhancer];
const composedEnhancers = composeWithDevTools(...enhancers);

const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState: initialState,
    enhancers: [...enhancers]
});

initMessageListener(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;