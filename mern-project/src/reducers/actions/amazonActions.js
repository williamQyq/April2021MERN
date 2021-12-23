import axios from 'axios';
import Moment from 'moment';
import {
    GET_AMZ_PROD_PRICING,
    AMAZON_RES_LOADING,
    GET_ERRORS,
} from './types';

// GET Upc Asins Mapping Record from db, then get asin pricing info via SP API,
// then get upc quantity info from wms. Finally, dispatch product pricing data.
export const getProductPricing = () => dispatch => {
    dispatch(setAmazonResLoading());

    getUpcAsinsFromDatabase()
        .then(async ({ asinsAll, prods }) => {
            try {
                const data = await mergeProdPricAPIAndWmsInfo(asinsAll, prods)
                dispatch({
                    type: GET_AMZ_PROD_PRICING,
                    payload: data
                })

            } catch (e) {
                dispatch({
                    type: GET_ERRORS
                })
            }
        })

}

// prods 
const mergeProdPricAPIAndWmsInfo = async (asinsAll, prods) => {
    let prodAsinIndex = 0;
    let amzProd = await callProductPricingAPI(asinsAll);   //get all asins amazon current price and sku info
    let wmsProd = await getUpcQuantityFromWms(prods);    //get wms qty on upc

    //For each prod, slice Amazon SP asin info including offers,Price, and etc.
    const data = prods.map((prod, index) => {
        let amzAsins = amzProd.slice(prodAsinIndex, prodAsinIndex + prod.asins.length);
        prodAsinIndex += prod.asinCount;
        if (wmsProd[index.upc] == prod.upc)
            return ({
                key: prod.key,
                upc: prod.upc,
                qty: wmsProd[index].qty,
                amzAsins: amzAsins,

            })
    })

    return data
}

// Prepare asins argument for amazon SP API 
const getUpcAsinsFromDatabase = async () => {
    const asinsAll = [];
    const prods = [];
    let count = 0;

    await axios.get('/api/amazonSP').then(res => {
        res.data.forEach(prod => {
            let asins = [];
            prod.identifiers.forEach((identifier, index) => {
                asins.push(identifier.asin);
                count = index + 1;
            })

            let rec = {
                key: prod._id,
                upc: prod.upc,
                asins: asins    //record the number of product's asins which is used to slice all asins array.
            }
            prods.push(rec);
            asinsAll.push(asins)
        })
    })

    return { asinsAll, prods };
}
const getUpcQuantityFromWms = prods => (
    axios.post('/api/wms', prods).then(res => {
        return res.data
    })
)

// get Product Pricing from Amazon SP
const callProductPricingAPI = asins => (
    axios.post('/api/amazonSP/prod_pricing', { asins })
        .then(res => res.data)
)

const setAmazonResLoading = () => {
    return {
        type: AMAZON_RES_LOADING
    };
}