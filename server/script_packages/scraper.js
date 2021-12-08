const WatchListItem = require('../models/WatchListItem');
const BBItem = require('../models/BBItem');
const MsItem = require('../models/MsItem');
const {
    BBScript,
    BBSkuItemScript,
    MsScript,
    MsSkuItemScript
} = require('./scripts.js');


const bbLinkScraper = (_id, link) => {
    //Script Object crawl product price from a link
    let product = new BBScript(WatchListItem);

    getBestBuyLaptopPrice(product, _id, link).then(() => {
        console.log(`bbscraper: ${JSON.stringify(product.data)}`)
        product.updateDBPriceById(Watch, product.data);
    })

}
const getBestBuyLaptopPrice = (product, _id, link) => {
    //spawn script process to get product price
    const python = product.spawnPriceScript(_id, link);

    //listen stdout of script, get product price info
    product.listenOn(python);

    return new Promise((resolve, reject) => {
        product.listenClose(python, resolve);
        product.listenErr(python, reject);
    });
}

//Load bestbuy all new products lists Promise
//Get bestbuy page numbers; then for each page and sku item, findSkuAndUpdate
const bestbuyScraper = async () => {
    return getNumOfAllNewLaptops(BBScript)
        .then(pageInfo => {
            console.log(`[BB num of all laptops new condtion]: ${pageInfo.total_num} - ${pageInfo.num_per_page}/per page.`);
            return getAllNewLaptops(BBSkuItemScript, BBItem, pageInfo.total_num, pageInfo.num_per_page)
        })
}

//Load microsoft all new products lists Promise
//Get microsoft page numbers; then for each page and sku item, findSkuAndUpdate
const microsoftScraper = async () => {
    return getNumOfAllNewLaptops(MsScript)
        .then(pageInfo => {
            console.log(`[MS num of all laptops new condtion]: ${pageInfo.total_num} - ${pageInfo.num_per_page}/per page.`);
            return getAllNewLaptops(MsSkuItemScript, MsItem, pageInfo.total_num, pageInfo.num_per_page)
        })
}

// get all laptops new condition number promise, resolve when retrieve items number.
const getNumOfAllNewLaptops = (StoreScript) => {

    let store = new StoreScript();

    //spawn script to get items number
    const python = store.spawnScript(store.pageNumScriptPath, store.link);

    // listen for script, get total items number
    store.listenOn(python);
    return new Promise((resolve, reject) => {
        store.listenClose(python, resolve);
        store.listenErr(python, reject);
    });
}

// get all laptops sku-items promise, resolve when retrieve all skus, names, currentPrices.
const getAllNewLaptops = (StoreScript, StoreItemModel, totalNum, numEachPage) => {

    let store = new StoreScript(StoreItemModel);

    const pageInfo = store.getLinkInfo(totalNum, numEachPage);
    const python = store.spawnScript(store.skuItemScriptPath, pageInfo);
    store.listenOn(python);
    return new Promise((resolve, reject) => {
        store.listenClose(python, resolve);
        store.listenErr(python, reject);
    });
}

module.exports = {
    bbLinkScraper: bbLinkScraper,
    bestbuyScraper: bestbuyScraper,
    microsoftScraper: microsoftScraper,
}