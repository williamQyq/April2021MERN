import {
    Action,
    AnyAction,
    Dispatch,
    Middleware,
    MiddlewareAPI
} from 'redux';

export const abortMiddleware = (abortSignal: AbortSignal | undefined): Middleware => (api: MiddlewareAPI) => (next: Dispatch<AnyAction>) => (action: Action) => {
    console.log(`abortMiddleware`)
    if (abortSignal && abortSignal.aborted) {
        console.log(`Action aborted`)
        return;
    }
    // api.dispatch({type:"ACTION_TYPE",payload:PAYLOAD})
    return next(action);
}
