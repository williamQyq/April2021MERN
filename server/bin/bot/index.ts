import puppeteer from 'puppeteer';

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
export interface Pagination {
    itemCntPerPage?: number,
    pageCnt?: number
}
export interface DealMessage {
    storeName: string;
    indexPage: number;
    index: number;
    sku: string;
    currentPrice: number | undefined;
    status: "Success" | "Fail" | "In Progress" | string;
}
export class MyMessage {
    storeName: string;
    constructor(storeName: string) {
        this.storeName = storeName;
    }
    printGetDealMsg(deal: DealMessage) {
        const storeTag = `[${deal.storeName}]`.padEnd(10, " ");
        const page = deal.indexPage.toString().padEnd(4, " ");
        const index = deal.index.toString().padEnd(4, " ");
        const status = deal.status.padEnd(9, " ");
        const sku = deal.sku;
        console.log(`${storeTag} | Page: ${page} | Index: ${index} | Status: ${status} | Current SKU: ${sku}`);
    }
    printPageEndLine(index: number) {
        const storeTag = `[${this.storeName}]`.padEnd(10, " ");
        console.log(`${storeTag}=== Page: ${index} done ===`);
    }
    printSplitLine(char: string) {
        const line = char.repeat(20);
        console.log(line);
    }
    printError(err: unknown) {
        this.printSplitLine("*");
        const errorTag = "[Error]".padEnd(7, " ");
        console.error(`\n${errorTag}\n\n${err}\n`);
        console.log("[End]");
        this.printSplitLine("*");
    }
    printPagination(pageCnt: number, itemCntPerPage: number) {
        const paginationTag = `[Pagination | ${this.storeName}]`;
        console.log(`${paginationTag} | pageItemsCount: ${itemCntPerPage} | page count: ${pageCnt}`);
    }
}

export abstract class DealBot {
    // constructor() {

    // }
    abstract editParamPageNumInUrl(pageIndex: number): void;
    abstract getPagination(page: puppeteer.Page, url: string): Promise<Pagination>;

    async initBrowser(): Promise<puppeteer.Browser> {
        const browser: puppeteer.Browser = await puppeteer.launch({
            headless: true,
            // headless: false, //show browser
            args: [
                '--single-process',
                '--no-zygote',
                '--no-sandbox',
                '--disable-web-security',
                '--disable-setuid-sandbox',
                '--window-size=1920,1080'
            ],
        });
        return browser;
    }
    async initPage(browser: puppeteer.Browser) {
        const page: puppeteer.Page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 })   //set view port to 1920x1080
        // await page.setDefaultNavigationTimeout(0);
        // await page.setUserAgent(USER_AGENT);

        // Intercept assets request
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
    async evaluateElementsText(page: puppeteer.Page, XPATH_EXPR: string) {
        await page.waitForXPath(XPATH_EXPR)
        const elements = await page.$x(XPATH_EXPR)
        const textResult = await page.evaluate((...elements) =>
            (elements.map(e => e.textContent))
            , ...elements)
        return textResult;
    }

    //@param: puppeter page, xpath expression, attribute id
    //@return: attribute context
    async evaluateItemAttribute(page: puppeteer.Page, XPATH_EXPR: string, ATTRIBUTE_ID: string) {
        await page.waitForXPath(XPATH_EXPR)
        const elements = await page.$x(XPATH_EXPR)
        const res = await page.evaluate((ATTRIBUTE_ID, ...elements) =>
            (elements.map(e => e.getAttribute(ATTRIBUTE_ID)))
            , ATTRIBUTE_ID, ...elements)

        return res;

    }
    //parse evaluate result no need
    async evaluatePriceAttribute(page: puppeteer.Page, XPATH_EXPR: string, ATTRIBUTE_ID: string) {
        await page.waitForXPath(XPATH_EXPR)
        const elements = await page.$x(XPATH_EXPR)
        let res = await page.evaluate((ATTRIBUTE_ID, ...elements) =>
            (elements.map(e => Number(e.getAttribute(ATTRIBUTE_ID).replace(/[$|,]/g, ""))))
            , ATTRIBUTE_ID, ...elements)

        return res
    }

    //map key of res with footer, asign res
    compareMapHelper(obj1: any, obj2: any) {
        for (let [key, val] of obj1) {
            val = obj2.get(key)
        }
        return obj1;
    }
    getRegexValue(str: string, regexExpr: string) {
        let match = str.match(regexExpr);
        let res = match?.slice(1)[0];
        return res ? res : null;
    }
}
