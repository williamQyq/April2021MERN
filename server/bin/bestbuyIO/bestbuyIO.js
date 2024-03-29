import axios from 'axios';
const DEFAULT_PAGE_SIZE = 50;

export const getMostViewedOnCategoryId = async (categoryId, pageSize = DEFAULT_PAGE_SIZE) => {

    let mostViewedProducts = [];

    let params = {
        apiKey: process.env.BESTBUY_API_KEY,
        format: 'json',
        pageSize,
    }

    //axios GET request to retrieve mostViewed product
    let categoryUrl = `https://api.bestbuy.com/v1/products/mostViewed(categoryId=${categoryId})`;
    // let categoryUrl = `https://api.bestbuy.com/v1/products/6455181/viewedUltimatelyBought`
    try {
        let res = await axios.get(categoryUrl, { params })

        let { results } = res.data; //bestbuy api mostViewed products results array.
        let isEmptyResult = results.length == 0 ? true : false

        if (isEmptyResult) {
            return;
        }
        mostViewedProducts = results.map(prod => {
            let validPropertiesProd = (({ sku, customerReviews, images, names, prices, rank }) => ({ sku, customerReviews, images, names, prices, rank }))(prod);
            return validPropertiesProd;
        })
    } catch (error) {
        throw error;
    }

    return mostViewedProducts;

}

export const getViewedUltimatelyBought = async (sku) => {
    let viewedUltimatelyBoughtProducts = [];
    let param = {
        params: {
            apiKey: BESTBUY_API_KEY,
        }
    }
    try {
        let res = await axios.get(`https://api.bestbuy.com/v1/products/${sku}/viewedUltimatelyBought`, param)


        let { results } = res.data;
        let isEmptyResult = results.length == 0 ? true : false

        if (isEmptyResult) {
            return;
        }
        viewedUltimatelyBoughtProducts = results.map(prod => {
            let validPropertiesProd = (({ sku, customerReviews, images, names, prices, rank }) => ({ sku, customerReviews, images, names, prices, rank }))(prod); //???
            return validPropertiesProd;
        })
    } catch (error) {
        throw error;
    }

    return viewedUltimatelyBoughtProducts;
}
export const getAlsoBoughtOnSku = async (sku) => {
    let alsoBoughtProducts = [];
    let param = {
        params: {
            apiKey: BESTBUY_API_KEY,
        }
    }
    try {
        let res = await axios.get(`https://api.bestbuy.com/v1/products/${sku}/alsoBought`, param)

        let { results } = res.data;
        let isEmptyResult = results.length == 0 ? true : false

        if (isEmptyResult) {
            return;
        }
        alsoBoughtProducts = results.map(prod => {
            let validPropertiesProd = (({ sku, customerReviews, images, names, prices, rank }) => ({ sku, customerReviews, images, names, prices, rank }))(prod); //???
            return validPropertiesProd;
        })
    } catch (error) {
        console.error(error)
    }

    return alsoBoughtProducts;

}