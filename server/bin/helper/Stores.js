import puppeteer from 'puppeteer';
import { USER_AGENT } from '#root/config.js'

/* 
declare class Stores{
    printMsg(msgMap)
    async initBrowser()
    async initPage(browser)
    async evaluateElementsText(page, XPATH_EXPR)
    async evaluateItemAttribute(page, XPATH_EXPR, ATTRIBUTE_ID)
    async evaluatePriceAttribute(page, XPATH_EXPR, ATTRIBUTE_ID)
    compareMapHelper(obj1, obj2)
    getRegexValue(str, regexExpr)

}

*/



export default class Stores {
    constructor() {
    }

    printMsg(msgMap) {
        // `[Bestbuy]page ${i} # ${index}: ${item.sku} - $${item.currentPrice} get item finished. <State: ${msg}>`
        console.log(
            `[${msgMap.get("store")}]page ${msgMap.get("page")} # ${msgMap.get("index")}: ${msgMap.get("sku")} - $${msgMap.get("currentPrice")} get item finished. <State: ${msgMap.get("msg")}>`
        )

    }
    async initBrowser() {
        const browser = await puppeteer.launch({
            headless: true,
            // headless: false,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                // '--window-size=1920,1080'
            ],
        });
        return browser;
    }
    async initPage(browser) {
        const page = await browser.newPage();
        // await page.setViewport({ width: 1920, height: 1080 })   //set view port to 1920x1080
        await page.setUserAgent(USER_AGENT);
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (req.resourceType() === 'image') {
                req.abort();
            } else {
                req.continue();
            }
        });
        return page
    }
    //@param: puppeter page, xpath expression
    //@return: text context
    async evaluateElementsText(page, XPATH_EXPR) {
        await page.waitForXPath(XPATH_EXPR)
        const elements = await page.$x(XPATH_EXPR)
        return await page.evaluate((...elements) =>
            (elements.map(e => e.textContent))
            , ...elements)
    }

    //@param: puppeter page, xpath expression, attribute id
    //@return: attribute context
    async evaluateItemAttribute(page, XPATH_EXPR, ATTRIBUTE_ID) {
        await page.waitForXPath(XPATH_EXPR)
        const elements = await page.$x(XPATH_EXPR)
        let res = await page.evaluate((ATTRIBUTE_ID, ...elements) =>
            (elements.map(e => e.getAttribute(ATTRIBUTE_ID)))
            , ATTRIBUTE_ID, ...elements)

        return res

    }
    //parse evaluate result no need
    async evaluatePriceAttribute(page, XPATH_EXPR, ATTRIBUTE_ID) {
        await page.waitForXPath(XPATH_EXPR)
        const elements = await page.$x(XPATH_EXPR)
        let res = await page.evaluate((ATTRIBUTE_ID, ...elements) =>
            (elements.map(e => Number(e.getAttribute(ATTRIBUTE_ID).replace(/[$|,]/g, ""))))
            , ATTRIBUTE_ID, ...elements)

        return res
    }

    //map key of res with footer, asign res
    compareMapHelper(obj1, obj2) {
        for (let [key, val] of obj1) {
            val = obj2.get(key)
        }
        return obj1;
    }
    getRegexValue(str, regexExpr) {
        let res = str.match(regexExpr).slice(1)[0]
        if (res == null)
            return null
        return res
    }
}
