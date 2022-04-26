import axios from 'axios';
import { BESTBUY_API_KEY } from '#root/config.js';
const DEFAULT_PAGE_SIZE = 50;

export const getMostViewedOnCategoryId = async (categoryId, pageSize = DEFAULT_PAGE_SIZE) => {

    let params = {
        apiKey: BESTBUY_API_KEY,
        format: 'json',
        pageSize,
    }


    //axios GET request to retrieve mostViewed product
    // let categoryUrl = `https://api.bestbuy.com/v1/products/mostViewed(categoryId=${categoryId})`;
    // let categoryUrl = `https://api.bestbuy.com/v1/products/6455181/viewedUltimatelyBought`
    let categoryUrl = `https://api.bestbuy.com/v1/products/6455181/alsoBought`
    let mostViewedProducts = await axios.get(categoryUrl, { params }).then(res => {
        let { results } = res.data;
        console.log(results)
        let isEmptyResult = results.length == 0 ? true : false

        if (isEmptyResult) {
            return ([]);
        }
        return results.map(prod => {
            let validPropertiesProd = (({ sku, customerReviews, images, names, prices, rank }) => ({ sku, customerReviews, images, names, prices, rank }))(prod);
            return validPropertiesProd;
        })
    })

    return mostViewedProducts;

}

export const getViewedUltimatelyBought = async (sku) => {
    let param = {
        params: {
            apiKey: BESTBUY_API_KEY,
        }
    }

    let viewedUltimatelyBoughtProducts = await axios.get(`https://api.bestbuy.com/v1/products/${sku}/viewedUltimatelyBought`, param).then(res => {
        let { results } = res.data;
        let isEmptyResult = results.length == 0 ? true : false

        if (isEmptyResult) {
            return ([]);
        }
        return results.map(prod => {
            let validPropertiesProd = (({ sku, customerReviews, images, names, prices, rank }) => ({ sku, customerReviews, images, names, prices, rank }))(prod);
            return validPropertiesProd;
        })
    })

    return viewedUltimatelyBoughtProducts;
}
