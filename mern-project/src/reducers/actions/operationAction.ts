import axios, { AxiosResponse } from 'axios';
import Papa from 'papaparse';
import { Dispatch } from 'redux';
import { tokenConfig } from './authActions';
import { RootState } from 'reducers/store/store';
import { GET_SKU_PRIME_COST, UPLOAD_PRIME_COST } from './types';
import { RcFile } from 'antd/es/upload';
import { returnMessages } from './messageActions';
import {
    myAxiosResponse,
    myAxiosError,
    UploadPrimeCostRequestBody,
    ISkuUploadFeeds,
} from 'reducers/interface';
import { returnErrors } from './errorActions';
import { FileUploadRequestOption, InitSkuStepsFormDataType, SkuConfig } from 'component/utility/cmpt.interface';
import fileDownload from 'js-file-download';
import { parseMyMultiAccessoriesDataSource } from './actionsHelper';

/**
 * 
 * @description save productPrimeCost xlsx data to db
 * 
 */
export const uploadProductsPrimeCost = (options: FileUploadRequestOption) => (dispatch: Dispatch, getState: () => RootState) => {
    const { file, onSuccess, onError } = options;

    Papa.parse(file as RcFile, {
        complete: (xlsx) => {
            const uploadFile = xlsx.data;
            const reqBody: UploadPrimeCostRequestBody = { fileData: uploadFile, isOverriden: true }
            axios.put('/api/operationV1/primeCost/v1/ProductsPrimeCost', reqBody, tokenConfig(getState))
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
    axios.get('/api/operationV1/template/v1/PrimeCostXlsxTemplate', { responseType: "blob" })
        .then((res: AxiosResponse<Blob>) => {
            fileDownload(res.data, "PrimeCostTemplate.xlsx");
        })
}

export const downloadInitSkuforAmzSPFeeds = (verifiedData: SkuConfig | null) => (dispatch: Dispatch, getState: RootState) => {
    axios.patch('/api/operationV1/listings/v1/offers', verifiedData, { ...tokenConfig(getState), responseType: "blob" })
        .then((res: AxiosResponse<Blob>) => {
            fileDownload(res.data, "skuUpload.xlsx");
        })
        .catch((err: myAxiosError) => {
            dispatch(returnErrors(err.response!.data.msg, err.response.status))
        })
}

/**
 * 
 * @param stepsFormData 
 * @returns 
 * 
 * @description set redux state generated sku with prime cost price
 */
export const calcVerifiedSkuPrimeCost = (abortSignal: AbortSignal, stepsFormData: InitSkuStepsFormDataType) => (dispatch: Dispatch, getState: RootState) => {
    const { dataSource, profitRate, addon } = stepsFormData;

    //ram, ssd in dataSource need to be parsed to convert from format "8GB_0" to "8GB" before requesting the primeCost.
    let parsedDataSource = dataSource.map(sku => {
        let parsedRam = sku.ram ? parseMyMultiAccessoriesDataSource(sku.ram) : [];
        let parsedSsd = sku.ssd ? parseMyMultiAccessoriesDataSource(sku.ssd) : [];
        sku.ram = parsedRam;
        sku.ssd = parsedSsd;

        const newDataSource = { ...sku, ram: parsedRam, ssd: parsedSsd };
        return newDataSource;
    })
    //the value of addon "{label:'Pen, value: 'pen', key:'pen'}[]"" needs to be extracted before requesting the primeCost. 
    let valueExtractedAddonItems = addon.map(labelItem => labelItem.value);

    axios.post(`/api/operationV1/primeCost/v1/skus/profitRate/addon/dataSource`, {
        dataSource: parsedDataSource,
        addon: valueExtractedAddonItems,
        profitRate
    }, {
        signal: abortSignal,
        ...tokenConfig(getState)
    })
        .then((res: AxiosResponse<{ data: ISkuUploadFeeds | undefined }>) => {
            dispatch({
                type: GET_SKU_PRIME_COST,
                payload: res.data
            })
        })
        .catch((err: myAxiosError) => {
            dispatch(returnErrors(err.response.data.msg, err.response.status, GET_SKU_PRIME_COST, err.response.data.reason))
        });
}