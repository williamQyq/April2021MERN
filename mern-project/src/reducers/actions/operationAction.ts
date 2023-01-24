import axios from 'axios';
import Papa from 'papaparse';
import { Dispatch } from 'redux';
import { tokenConfig } from './authActions';

import { UploadRequestOption } from 'rc-upload/lib/interface';
import { RootState } from 'reducers/store/store';
import { UPLOAD_PRIME_COST } from './types';
import { RcFile } from 'antd/es/upload';
import { returnMessages } from './messageActions';
import { myAxiosResponse } from 'reducers/types';


export const uploadProductsPrimeCost = (options: UploadRequestOption) => (dispatch: Dispatch, getState: () => RootState) => {
    const { file, onSuccess, onError } = options;

    Papa.parse(file as RcFile, {
        complete: (xlsx) => {
            const uploadFile = xlsx.data;
            console.log(xlsx.data);
            onSuccess!(null);
            // axios.post('/api/operation/v1/saveProductsPrimeCost', uploadFile, tokenConfig(getState))
            //     .then((res: myAxiosResponse) => {
            //         dispatch({
            //             type: UPLOAD_PRIME_COST
            //         });
            //         onSuccess!(res.data.msg);
            //         dispatch(returnMessages(res.data.msg, res.status, UPLOAD_PRIME_COST));
            //     })
            //     .catch(err => {
            //         onError!(err);
            //     })
        },
        error: (error, file) => {
            console.error(error);
            onError!(error);
        },
    })
}