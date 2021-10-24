
const WL_Item = require('../models/WatchListItem');
const BBItem = require('../models/BBItem');
const CCItem = require('../models/CCItem');
const {
    BBScript,
    BBNumScript,
    BBSkuItemScript,
} = require('./Scripts.js');


const bbLinkScraper = (_id, link) => {
    //Script Object crawl product price from a link
    let BBProdPrice = new BBScript(WL_Item);

    bbLaptopPricePromise(BBProdPrice, _id, link).then(() => {
        console.log(`bbscraper: ${JSON.stringify(BBProdPrice.data)}`)
        BBProdPrice.updateDBPriceById(WL_Item, BBProdPrice.data);
    })

}
const bbLaptopPricePromise = (BBProdPrice, _id, link) => {
    //spawn script process to get product price
    const python = BBProdPrice.spawnPriceScript(_id, link);

    //listen stdout of script, get product price info
    BBProdPrice.listenOn(python);
    const getLaptopPricePromise = new Promise((resolve, reject) => {
        BBProdPrice.listenClose(python, resolve);
        BBProdPrice.listenErr(python, reject);
    });
    return getLaptopPricePromise;
}

// load bb Condition New all products lists
const pyProcessBB = () => {
    let BBNum = new BBNumScript(BBItem);
    let BBSkuItems = new BBSkuItemScript(BBItem);
    //1. get bb sku-items num then
    //2. Each laptops page contains 24 sku items, calculate and init array of links.
    //3. for each page, for each sku item, findskuAndUpdate.
    bbAllLaptopsNewNumPromise(BBNum).then(() => {
        console.log(`[BB num of all laptops new condtion]: ${BBNum.data.num} - ${BBNum.data.num_per_page}/per page.`);
        bbAllLaptopsSkuItemsPromise(BBSkuItems, BBNum.data.num, BBNum.data.num_per_page).then(() => {
            console.log("[BBSkuItem Script] update all sku items finished.\n")
        }, () => {
            console.log("[BBSkuItem Script] Failure");
        })
    }, () => {
        console.log("[BBNum Script] Failure.");
    })

}
// get all laptops new condition number promise, resolve when retrieve items number.
const bbAllLaptopsNewNumPromise = (BBNum) => {

    //spawn script to get items number
    const python = BBNum.spawnScript(BBNum.link);

    // listen for script, get total items number
    BBNum.listenOn(python);
    const getAllLaptopsNumPromise = new Promise((resolve, reject) => {
        BBNum.listenClose(python, resolve);
        BBNum.listenErr(python, reject);
    });
    return getAllLaptopsNumPromise;
}

// get all laptops sku-items promise, resolve when retrieve all skus, names, currentPrices.
const bbAllLaptopsSkuItemsPromise = (BBSkuItems, num, numPerPage) => {
    const link_info = BBSkuItems.getLinkInfo(num, numPerPage);
    const sku_items_python = BBSkuItems.spawnScript(link_info);
    BBSkuItems.listenOn(sku_items_python);
    const getBBSkuItemsPromise = new Promise((resolve, reject) => {
        BBSkuItems.listenClose(sku_items_python, resolve);
        BBSkuItems.listenErr(sku_items_python, reject);
    });
    return getBBSkuItemsPromise;
}

module.exports = {
    bbLinkScraper: bbLinkScraper,
    pyProcessBB: pyProcessBB,
    // pyProcessCC: pyProcessCC,

}