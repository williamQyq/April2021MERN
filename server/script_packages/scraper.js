
const WatchListItem = require('../models/WatchListItem');
const BBItem = require('../models/BBItem');
const MsItem = require('../models/MsItem');
const {
    BBScript,
    BBNumScript,
    BBSkuItemScript,
    MsScript,
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

// load bb Condition New all products lists
const pyProcessBB = () => {
    //1. get bb sku-items num then
    //2. Each laptops page contains 24 sku items, calculate and init array of links.
    //3. for each page, for each sku item, findskuAndUpdate.
    getNumOfAllNewLaptops().then(pageInfo => {

        console.log(`[BB num of all laptops new condtion]: ${pageInfo.num} - ${pageInfo.num_per_page}/per page.`);
        getAllNewLaptops(pageInfo.num, pageInfo.num_per_page).then(result => {
            console.log(result);
        })
            .catch(err => {
                console.error(err);
                return err;
            })
    })
        .catch(err => {
            console.error(err);
            return err;
        })

}
// // get all laptops new condition number promise, resolve when retrieve items number.
// const getNumOfAllNewLaptops = () => {

//     let bestbuy = new BBNumScript(BBItem);

//     //spawn script to get items number
//     const python = bestbuy.spawnScript(bestbuy.link);

//     // listen for script, get total items number
//     bestbuy.listenOn(python);
//     return new Promise((resolve, reject) => {
//         bestbuy.listenClose(python, resolve);
//         bestbuy.listenErr(python, reject);
//     });
// }

// // get all laptops sku-items promise, resolve when retrieve all skus, names, currentPrices.
// const getAllNewLaptops = (num, numPerPage) => {

//     let bestbuy = new BBSkuItemScript(BBItem);

//     const page = bestbuy.getLinkInfo(num, numPerPage);
//     const python = bestbuy.spawnScript(page);
//     bestbuy.listenOn(python);
//     return new Promise((resolve, reject) => {
//         bestbuy.listenClose(python, resolve);
//         bestbuy.listenErr(python, reject);
//     });
// }

const microsoftScraper = () => {
    getNumOfAllNewLaptops(MsScript, MsItem).then(pageInfo => {
        getAllNewLaptops(MsScript, MsItem, pageInfo.pages, pageInfo.numEachPage).then(result => {
            console.log(result);
        })
            .catch(err => {
                console.error(err);
                return err;
            })
    })
        .catch(err => {
            console.error(err);
            return err;
        })
}

// get all laptops new condition number promise, resolve when retrieve items number.
const getNumOfAllNewLaptops = (StoreScript, StoreItemModel) => {

    let store = new StoreScript(StoreItemModel);

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
const getAllNewLaptops = (StoreScript, StoreItemModel, pages, numEachPage) => {

    let store = new StoreScript(StoreItemModel);

    const pageInfo = store.getLinkInfo(pages, numEachPage);
    const python = store.spawnScript(store.skuItemScriptPath, pageInfo);
    store.listenOn(python);
    return new Promise((resolve, reject) => {
        store.listenClose(python, resolve);
        store.listenErr(python, reject);
    });
}
module.exports = {
    bbLinkScraper: bbLinkScraper,
    pyProcessBB: pyProcessBB,
    microsoftScraper: microsoftScraper,
}