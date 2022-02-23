/*
    this file for functionality testing purpose

*/

const { puppeteerErrors } = require('puppeteer');
const { Bestbuy, Microsoft } = require('./script_packages/Stores.js');
const { getMicrosoftLaptops } = require('./script_packages/scraper');
const { saveStoreItemToDatabase } = require('./query/utitlities.js');
const MSItem = require('./models/MsItem');

const main = async () => {
    await getMicrosoftLaptops()
}

const puppeteerStoresTest = async () => {

    // try {
    //     let ms = new Microsoft();
    //     msUrl = ms.url
    //     url = msUrl.base + msUrl.skipItemsNum

    //     let browser = await ms.initBrowser();
    //     let page = await ms.initPage(browser);
    //     let items = await ms.getItems(page, url)

    //     console.log(JSON.stringify(items, null, 4))

    //     await page.close();
    //     await browser.close();
    // } catch (e) {
    //     console.log(`Error========:\n`, e)
    // }
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

module.exports = { main }
