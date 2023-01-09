export interface IReduxError {
    status: number;
    msg: string;
    reason: unknown;
}

export interface IReduxAuth {
    token: string;
    isAuthenticated: boolean;
    isLoading: boolean;
}