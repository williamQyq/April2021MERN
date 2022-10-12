// SELF LIST STATUS
export const GET_ITEMS = 'GET_ITEMS';
export const ADD_ITEM = 'ADD_ITEM';
export const DELETE_ITEM = 'DELETE_ITEM';
export const ITEMS_LOADING = 'ITEMS_LOADING';
// *deprecate soon*
export const SET_TABLE_STATE = 'SET_TABLE_STATE';
export const SET_TABLE_SETTINGS = 'SET_TABLE_SETTINGS';

// @STORES*
export const MICROSOFT = 'MICROSOFT';
export const BESTBUY = 'BESTBUY';
export const COSTCO = 'COSTCO';
export const WALMART = 'WALMART';

/* 
@BB STATUS
*/
export const GET_BB_ITEMS = 'GET_BB_ITEMS';
export const GET_BB_ITEMS_ONLINE_PRICE = 'GET_BB_ITEMS_ONLINE_PRICE';
export const BB_ITEMS_ONLINE_PRICE_LOADING = 'BB_ITEMS_ONLINE_PRICE_LOADING';
export const GET_BB_ITEM_DETAIL = 'GET_BB_ITEM_DETAIL';
export const ADD_BB_ITEM_SPEC = 'GET_BB_ITEM_SPEC';
export const ITEMS_LOADING_BB = 'ITEMS_LOADING_BB';
export const GET_BB_MOST_VIEWED_ITEMS = "GET_BB_MOST_VIEWED_ITEMS";
export const GET_BB_VIEWED_ULTIMATELY_BOUGHT_ITEMS = "GET_BB_VIEWED_ULTIMATELY_BOUGHT_ITEMS";
export const MOST_VIEWED_ITEMS_LOADING = "MOST_VIEWED_ITEMS_LOADING";
export const GET_BB_ALSO_BOUGHT_ITEMS = "GET_BB_ALSO_BOUGHT_ITEMS";
export const GET_BESTBUY_API_ERRORS = "GET_BESTBUY_API_ERRORS";
export const CLEAR_BESTBUY_ERRORS = "CLEAR_BESTBUY_ERRORS";
export const ON_RETRIEVED_BB_ITEMS_ONLINE_PRICE = "ON_RETRIEVED_BB_ITEMS_ONLINE_PRICE";
export const RETRIEVE_BB_ITEMS_ONLINE_PRICE_ERROR = "RETRIEVE_BB_ITEMS_ONLINE_PRICE_ERROR";


/* 
@CC STATUS 
*/
export const GET_CC_ITEMS = 'GET_BB_ITEMS';

/* 
@MS STATUS 
*/
export const GET_MS_ITEMS = 'GET_MS_ITEMS';
export const GET_MS_ITEMS_ONLINE_PRICE = 'GET_MS_ITEMS_ONLINE_PRICE';
export const GET_MS_ITEM_DETAIL = 'GET_MS_ITEM_DETAIL';
export const ADD_MS_ITEM_SPEC = 'GET_BB_ITEM_SPEC';
export const ITEMS_LOADING_MS = 'ITEMS_LOADING_MS';
export const MS_ITEMS_ONLINE_PRICE_LOADING = 'MS_ITEMS_ONLINE_PRICE_LOADING';
export const CLEAR_MICROSOFT_ERRORS = "CLEAR_MICROSOFT_ERRORS";
export const ON_RETRIEVED_MS_ITEMS_ONLINE_PRICE = "ON_RETRIEVED_MS_ITEMS_ONLINE_PRICE";
export const RETRIEVE_MS_ITEMS_ONLINE_PRICE_ERROR = "RETRIEVE_MS_ITEMS_ONLINE_PRICE_ERROR";
/* 
@WM STATUS
*/
export const GET_WM_ITEMS = 'GET_WM_ITEMS';
export const GET_WM_ITEM_DETAIL = 'GET_WM_ITEM_DETAIL';
export const ADD_WM_ITEM_SPEC = 'GET_WM_ITEM_SPEC';
export const ITEMS_LOADING_WM = 'ITEMS_LOADING_WM';

// @AUTHENTICATE STATUS
export const USER_LOADING = 'USER_LOADING';
export const USER_LOADED = 'USER_LOADED';
export const AUTH_ERROR = 'AUTH_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAIL = 'REGISTER_FAIL';
export const GET_ERRORS = 'GET_ERRORS';
export const CLEAR_ERRORS = 'CLEAR_ERRORS';
export const GET_MESSAGES = 'GET_MESSAGES';
export const CLEAR_MESSAGES = 'CLEAR_MESSAGES';
export const SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE';

// @KEEPA: KEEPA STATUS
export const KEEPA_LOADING = 'KEEPA_LOADING';
export const GET_KEEPA_STAT = 'GET_KEEPA_STAT';

// @OPERATION: AMAZON
export const PRODUCT_LIST_LOADING = 'RES_LOADING';
export const RES_LOADED = 'RES_LOADED';
export const GET_AMZ_PROD_PRICING = 'GET_AMZ_PROD_PRICING';


// @OPERATION: UPLOAD
export const UPLOAD_ASINS_MAPPING = 'UPLOAD_MAPPING';
export const GET_UPC_ASIN_MAPPING = 'GET_UPC_ASIN_MAPPING';
export const ADD_ITEM_SPEC = 'ADD_ITEM_SPEC';
// export const GET_ITEM_SPEC = 'GET_ITEM_SPEC';

//@WMS
export const GET_WAREHOUSE_QTY = "GET_WAREHOUSE_QTY";
export const SYNC_INVENTORY_RECEIVED_WITH_GSHEET = "SYNC_INVENTORY_RECEIVED_WITH_GSHEET";
export const INVENTORY_RECEIVED_LOADING = "INVENTORY_RECEIVED_LOADING";
export const GET_INVENTORY_RECEIVED_ITEMS = "GET_INVENTORY_RECEIVED_ITEMS";
export const SHIPMENT_ITEMS_LOADING = "SHIPMENT_ITEMS_LOADING";
export const GET_SHIPMENT_ITEMS = "GET_SHIPMENT_ITEMS";
export const UPDATE_INVENTORY_RECEIVE = "UPDATE_INVENTORY_RECEIVE";
export const GET_SHIPMENT_ITEMS_WITH_LIMIT = "GET_SHIPMENT_ITEMS_WITH_LIMIT";
export const GET_SHIPPED_NOT_VERIFIED_SHIPMENT = "GET_SHIPPED_NOT_VERIFIED_SHIPMENT";
export const CONFIRM_SHIPMENT = "CONFIRM_SHIPMENT";
export const SEARCH_SHIPMENT_LOADING = "SEARCH_SHIPMENT_LOADING";
export const SEARCH_OUTBOUND_SHIPMENT = "SEARCH_OUTBOUND_SHIPMENT";
export const SEARCH_RECEIVAL_SHIPMENT = "SEARCH_RECEIVAL_SHIPMENT";
export const SEARCH_LOCATION_INVENTORY = "SEARCH_LOCATION_INVENTORY";
export const SEARCH_SELLER_INVENTORY = "SEARCH_SELLER_INVENTORY";
export const CONFIRM_SHIPMENT_LOADING = "CONFIRM_SHIPMENT_LOADING";

export const FILE_DOWNLOADED = "FILE_DOWNLOADED";
export const FILE_DOWNLOADING = "FILE_DOWNLOADING";