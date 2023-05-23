import {
    Action,
    AnyAction,
    Dispatch,
    Middleware,
    MiddlewareAPI
} from '@reduxjs/toolkit';

export const abortMiddleware = (abortSignal: AbortSignal | undefined): Middleware<{}, any, Dispatch<AnyAction>> =>
    (api: MiddlewareAPI) =>
        (next: Dispatch<AnyAction>) =>
            (action: Action) => {
                if (abortSignal && abortSignal.aborted) {
                    console.log(`Action aborted`)
                    return;
                }
                // api.dispatch({type:"ACTION_TYPE",payload:PAYLOAD})
                return next(action);
            }
