/*
    this file for functionality testing purpose

*/

const { puppeteerErrors } = require('puppeteer');
const { getMicrosoftLaptops, getBestbuyLaptops } = require('./script_packages/scraper');
const { saveStoreItemToDatabase, findAllProdPricing } = require('./query/utilities.js');
const MSItem = require('./models/MsItem');
const Bestbuy = require('./script_packages/BB.js');
const { getSellingPartnerProdPricing } = require('./amazonSP/amazonSchedule');
const ProdPricing = require('./amazonSP/SPAPI/ProdPricing');
const { bucket } = require('./amazonSP/RateLimiter');

const main = async () => {
    // await getMicrosoftLaptops()
    // await getBestbuyLaptops()
    // puppeteerStoresPageTest()

    // await getSellingPartnerProdPricing()

    // let pp = new ProdPricing();
    // findAllProdPricing()
    //     .then(prods => pp.createProdAsinsMapping(prods))
    //     .then(upcAsinsMap => {
    //         for (let [upc, asins] of upcAsinsMap) {
    //             // console.log(upc, asins)
    //             // let task = pp.createTask(upc, asins)
    //             // bucket.addTask(task)
    //         }
    //     })
    //     .then(() => {
    //         // bucket.doTaskQueue()
    //     })

}

const puppeteerStoresPageTest = async () => {
    let store = new Bestbuy();
    let url = store.initURL(5)
    try {

        let browser = await store.initBrowser();
        let page = await store.initPage(browser);
        let items = await store.getPageItems(page, url)

        console.log(JSON.stringify(items, null, 4))

        await page.close();
        await browser.close();
    } catch (e) {
        console.log(`Error========:\n`, e)
    }
}
const puppSaveStoreItemTest = async () => {
    let item = {
        "link": "https://www.microsoft.com/en-us/d/surface-laptop-go/94FC0BDGQ7WV",
        "sku": "94",
        "currentPrice": 499.99,
        "name": "Surface Laptop Go"
    }
    try {
        await saveStoreItemToDatabase(item, MSItem)
    } catch (e) {
        console.error(e)
    }
}
const puppeteerStoresPageNumTest = async () => {
    try {
        let ms = new Microsoft();
        msUrl = ms.url
        url = msUrl.base + msUrl.skipItemsNum

        let browser = await ms.initBrowser();
        let page = await ms.initPage(browser);
        let pagesNum = await ms.getPagesNum(page, url)

        console.log(`pagesNum`, pagesNum)
        await page.close();
        await browser.close();
    } catch (e) {
        console.log(`Error========:\n`, e)
    }
}

module.exports = {
    main
}
