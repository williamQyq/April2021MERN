import { Middleware, applyMiddleware } from 'redux';
import { createStateSyncMiddleware, initMessageListener } from 'redux-state-sync';
import thunk from 'redux-thunk';
import rootReducer from '@redux-reducer/index';
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    PersistConfig,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { configureStore } from '@reduxjs/toolkit';
import { ReduxRootState } from '../interface';

const persistConfig: PersistConfig<ReduxRootState> = {
    key: "root",
    storage
    // blacklist:[]
}
const persistedReducer = persistReducer(persistConfig, rootReducer);

const initialState = {};
const middlewares: Middleware[] = [
    thunk,
    createStateSyncMiddleware({
        blacklist: ["persist/PERSIST", "persist/REHYDRATE"],
    }),
];
const middlewareEnhancer = applyMiddleware(...middlewares);
const enhancers = [middlewareEnhancer];
// const composedEnhancers = composeWithDevTools(...enhancers);

const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState: initialState,
    enhancers: [...enhancers],
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            immutableCheck: {
                warnAfter: 128
            },
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            }
        })
});

initMessageListener(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;