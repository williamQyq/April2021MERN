import axios from 'axios';
import fileDownload from 'js-file-download';
import moment from 'moment';
import { tokenConfig } from './authActions.js';
import { clearErrors, returnErrors } from './errorActions.js';
import {
    setInventoryReceivedLoading,
    setSearchShipmentLoading,
    setShipmentItemsLoading
} from './loadingActions.js';
import { clearMessages, returnMessages } from './messageActions.js';
import {
    CONFIRM_SHIPMENT,
    GET_ERRORS,
    GET_SHIPMENT_ITEMS_WITH_LIMIT,
    GET_SHIPPED_NOT_VERIFIED_SHIPMENT,
    SEARCH_OUTBOUND_SHIPMENT,
    SERVICE_UNAVAILABLE,
    SYNC_INVENTORY_RECEIVED_WITH_GSHEET
} from './types.js';


export const syncInventoryReceivedWithGsheet = () => (dispatch, getState) => {
    dispatch(setInventoryReceivedLoading())
    axios.get(
        `/api/wms/inventoryReceive/v0/getInventoryReceiveInHalfMonth/updateGsheet`,
        tokenConfig(getState)
    )
        .then((res) => {
            dispatch({
                type: SYNC_INVENTORY_RECEIVED_WITH_GSHEET,
                payload: res.data
            })
            dispatch(clearMessages())
            dispatch(returnMessages(res.data.msg, res.status))
        })
        .catch(err => {
            dispatch({
                type: SYNC_INVENTORY_RECEIVED_WITH_GSHEET,
                payload: []
            })
            dispatch(returnErrors(err.response.data.msg, err.response.status))
        })
}

//@desc: get Shipment On Required Fields
export const getShipment = (requiredFields) => (dispatch, getState) => {
    dispatch(setSearchShipmentLoading());
    axios.post(
        `/api/wms/shipment/v0/getShipment`,
        { requiredFields },
        tokenConfig(getState)
    )
        .then(res => {
            dispatch({
                type: SEARCH_OUTBOUND_SHIPMENT,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch({
                type: SEARCH_OUTBOUND_SHIPMENT,
                payload: []
            })
            dispatch(clearErrors());
            dispatch(returnErrors(err.response.data.msg, err.response.status, GET_ERRORS));
        })
}

export const downloadShipment = (requiredFields = {}) => (dispatch, getState) => {
    axios.post('/api/wms/shipment/v0/downloadShipmentXlsx', { requiredFields, responseType: "blob" })
        .then((res) => {
            fileDownload(res.data, 'shipmentRecords.xlsx')
        })
}

export const downloadPickUpListPDF = (requiredFields) => (dispatch, getState) => {
    const dateString = moment().format('MMMM-Do-YYYY-h-mm-a-');
    let fileName = dateString.concat("pickUp.pdf");
    requiredFields.fileName = fileName;
    axios.post('/api/wmsV1/shipment/v1/downloadPickUpPDF', {
        requiredFields, responseType: 'blob',
    }, tokenConfig(getState))
        .then((resp) => {
            console.log(resp.config);
            const url = window.URL.createObjectURL(new Blob([resp.data], { type: "application/pdf" }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            // const pdfBlob = new Blob([res.data], { type: "application/pdf" })
            // fileDownload(pdfBlob, fileName);
        })
}

//axios get needtoship documents for inifite scroll
export const getNeedToShipFromShipmentWithLimit = (docLimits, docSkip) => async (dispatch, getState) => {
    dispatch(setShipmentItemsLoading());
    return axios.get(
        `/api/wms/shipment/v0/getNeedToShipItems/limit/${docLimits}/skip/${docSkip}`, {
        ...tokenConfig(getState),
        params: {
            docLimits,
            docSkip
        }
    })
        .then(res => {
            dispatch({
                type: GET_SHIPMENT_ITEMS_WITH_LIMIT,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch({
                type: GET_SHIPMENT_ITEMS_WITH_LIMIT,
                payload: []
            })
            dispatch(clearErrors());
            dispatch(returnErrors(err.response.data.msg, err.response.status, GET_ERRORS))
        })
}

export const getNeedToShipPendingAndTotalCount = (orgNm = "M") => async (dispatch, getState) => {
    let shipmentCountInfo = await axios.get(
        `/api/wms/shipment/v0/getPendingAndTotal/${orgNm}`, {
        ...tokenConfig(getState),
        params: {
            orgNm
        }
    })
        .then(res => res.data);

    return shipmentCountInfo;
}


//get shipped but not qty deducted shipment info
export const getShippedNotVerifiedShipmentByDate = (dateRange) => (dispatch, getState) => {
    const [dateMin, dateMax] = dateRange;
    axios.get(
        `/api/wms/shipment/v0/getNotVerifiedShipment/dateMin/${dateMin}/dateMax/${dateMax}`,
        {
            ...tokenConfig(getState),
            params: {
                dateMin,
                dateMax
            }
        }
    )
        .then((res) => {
            dispatch({
                type: GET_SHIPPED_NOT_VERIFIED_SHIPMENT,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch(clearErrors());
            dispatch(returnErrors(err.response.data.msg, err.response.status, GET_ERRORS))
        })
}
export const confirmShipmentAndSubTractQty = (unShipmentArr) => async (dispatch, getState) => {
    if (unShipmentArr.length <= 0) {
        dispatch(returnMessages("No Shipment selected", 202, SERVICE_UNAVAILABLE));
        return;
    }
    return axios.post('/api/wms/needToShip/v0/confirmShipment', { allUnShipment: unShipmentArr }, tokenConfig(getState))
        .then((res) => {
            dispatch(returnMessages(res.data.msg, res.status, CONFIRM_SHIPMENT))
        })
        .catch(err => {
            console.log(`err reason: `, err.response.data.reason)
            dispatch(clearErrors());
            dispatch(returnErrors(err.response.data.msg, err.response.status, GET_ERRORS, err.response.data.reason));
        })
}