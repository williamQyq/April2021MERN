import { AxiosError, AxiosResponse } from "axios";

export type ActionType = string;

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

export interface myAxiosResponse extends AxiosResponse {
    data: {
        msg: string,
        reason: string,
        action?: ActionType,

    }
}
export interface myAxiosError extends AxiosError {
    response: myAxiosResponse;
};

export interface IRequestBody {
    fileData?: any;
    isOverriden?: boolean;
}
export interface UploadPrimeCostRequestBody extends Required<IRequestBody> { }