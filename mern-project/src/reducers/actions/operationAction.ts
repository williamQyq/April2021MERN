import axios, { AxiosResponse } from 'axios';
import Papa from 'papaparse';
import { Dispatch } from 'redux';
import { tokenConfig } from './authActions';
import { RootState } from 'reducers/store/store';
import { UPLOAD_PRIME_COST } from './types';
import { RcFile } from 'antd/es/upload';
import { returnMessages } from './messageActions';
import { myAxiosResponse, myAxiosError, UploadPrimeCostRequestBody } from 'reducers/interface';
import { returnErrors } from './errorActions';
import { FileUploadRequestOption } from 'component/utility/cmpt.interface';
import fileDownload from 'js-file-download';


export const uploadProductsPrimeCost = (options: FileUploadRequestOption) => (dispatch: Dispatch, getState: () => RootState) => {
    const { file, onSuccess, onError } = options;

    Papa.parse(file as RcFile, {
        complete: (xlsx) => {
            const uploadFile = xlsx.data;
            const reqBody: UploadPrimeCostRequestBody = { fileData: uploadFile, isOverriden: true }
            axios.post('/api/operationV1/upload/v1/saveProductsPrimeCost', reqBody, tokenConfig(getState))
                .then((res: myAxiosResponse) => {
                    dispatch({
                        type: UPLOAD_PRIME_COST
                    });
                    onSuccess!(res.data.msg);
                    dispatch(returnMessages(res.data.msg, res.status, UPLOAD_PRIME_COST));
                })
                .catch((err: myAxiosError) => {
                    onError!(err);
                    dispatch(returnErrors(err.response.data.msg, err.response.status, UPLOAD_PRIME_COST, err.response.data.reason))
                })
        },
        error: (error, file) => {
            console.error(error);
            onError!(error);
        },
    })
}

export const downloadProductPrimeCostTemplate = () => (dispatch: Dispatch, getState: RootState) => {
    axios.get('/api/operationV1/download/v1/downloadPrimeCostXlsxTemplate', { responseType: "blob" })
        .then((res: AxiosResponse<Blob>) => {
            fileDownload(res.data, "PrimeCostTemplate.xlsx");
        })
}