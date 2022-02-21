/*
    this file for functionality testing purpose

*/

const { puppeteerErrors } = require('puppeteer');
const { Bestbuy, Microsoft } = require('./script_packages/Stores.js');
const { getMicrosoftLaptops } = require('./script_packages/scraper');

const main = async () => {
    puppeteerStoresTest()
}

const puppeteerStoresTest = async () => {
    await getMicrosoftLaptops();
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

main();
