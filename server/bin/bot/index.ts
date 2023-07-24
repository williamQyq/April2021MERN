import puppeteer from 'puppeteer';
import { ElementHandle } from 'puppeteer';

export interface Pagination {
    itemCntPerPage?: number,
    pageCnt?: number
}
export interface DealMessage {
    storeName: string;
    indexPage?: number;
    index?: number;
    sku?: string;
    currentPrice?: number;
    status: "Success" | "Fail" | "In Progress" | string;
}
interface DealPageEndLineMessageParms {
    storeName: string,
    index: number
}

interface DealPrintPaginationMessageParms {
    pageCnt: number,
    itemCntPerPage: number,
    storeName: string
}
interface ElementInfo {
    element: ElementHandle<Element>,
    attributeId: string,
    selector: string
}
export class MyMessage {
    constructor() {
    }
    printGetDealMsg(deal: DealMessage) {
        const storeTag = `[${deal.storeName}]`.padEnd(10, " ");
        // const page = deal.indexPage?.toString().padEnd(4, " ");
        const index = deal.index?.toString().padEnd(4, " ");
        const status = deal.status.padEnd(9, " ");
        const sku = deal.sku;
        console.log(`${storeTag} | Index: ${index} | Status: ${status} | Current SKU: ${sku}`);
    }
    printPageEndLine({ storeName, index }: DealPageEndLineMessageParms) {
        const storeTag = `[${storeName}]`.padEnd(10, " ");
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
    printPagination({ pageCnt, itemCntPerPage, storeName }: DealPrintPaginationMessageParms) {
        const paginationTag = `[Pagination | ${storeName}]`;
        console.log(`${paginationTag} | pageItemsCount: ${itemCntPerPage} | page count: ${pageCnt}`);
    }
}

export abstract class DealBot {
    USER_AGENT: string = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    // constructor() {

    // }
    abstract editParamPageNumInUrl(pageIndex: number): void;
    abstract getPagination(page: puppeteer.Page, url: string): Promise<Pagination> | Promise<unknown>;
    abstract startScheduler(): void;
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
        await page.setUserAgent(this.USER_AGENT,);

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
        // const elements = await this.waitAllElementsForXPath(page, XPATH_EXPR) //wait until at least one matching elements loaded.
        await page.waitForXPath(XPATH_EXPR);
        const elements = await page.$x(XPATH_EXPR);
        const textContents = await Promise.all<Promise<string>>(
            elements.map((element) => page.evaluate((el) => el.textContent, element))
        );

        return textContents;

    }
    /**
     * 
     * @param page 
     * @param XPATH_EXPR 
     * @returns 
     * 
     * @description
     *      for elements that will loaded textContent only when scroll to its position.
     */
    async evaluateScrollLoadingElementsText(page: puppeteer.Page, XPATH_EXPR: string) {
        await page.waitForXPath(XPATH_EXPR);
        let elements = await page.$x(XPATH_EXPR);
        let prevElementsCount = elements.length;

        while (true) {
            await page.evaluate((el) => {
                el.scrollIntoView();    //not build-in in puppeteer, but excutable in browser.
            }, elements[elements.length - 1]);
            // Wait for new elements to load
            await page.waitForTimeout(3000); // Adjust the timeout as needed

            elements = await page.$x(XPATH_EXPR);
            if (elements.length === prevElementsCount) {
                break; // No more newly loaded elements
            }
            prevElementsCount = elements.length;
        }

        const textContents = await Promise.all(
            elements.map((element) => page.evaluate((el) => el.textContent, element))
        );

        return textContents;
    }

    async scrollingPage(page: puppeteer.Page, scrollDelay: number = 2000) {

        let currentHeight = await page.evaluate(() => document.documentElement.scrollHeight);
        let previousHeight = 0;

        while (currentHeight > previousHeight) {
            previousHeight = currentHeight;
            await page.evaluate(() => {
                window.scrollTo(0, document.documentElement.scrollHeight);
            });

            await page.waitForTimeout(scrollDelay);
            currentHeight = await page.evaluate(() => document.documentElement.scrollHeight);
        }
        return;
    }

    /**
     * 
     * @param page 
     * @param XPATH_EXPR 
     * @returns 
     * @description #TODO takes very long to wait for all elements loaded. Not working.
     */
    async waitAllElementsForXPath(page: puppeteer.Page, XPATH_EXPR: string) {
        await page.waitForFunction(
            (xpath: string) => {
                const elements = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
                let node;
                while (node = elements.iterateNext()) {
                    if (!node.textContent || node.textContent.trim().length === 0) return false;
                }
                return true;
            },
            {},
            XPATH_EXPR
        );
        return page.$x(XPATH_EXPR);
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
    getRegexValue(str: string, regexExpr: string | RegExp) {
        let match = str.match(regexExpr);
        return match ? match[1] : null;
    }
    async evaluateOneElementAttribute({ element, attributeId, selector }: ElementInfo): Promise<string> {
        try {
            return await element.$eval<string>(selector, (ele) => {
                const attributeValue = ele.getAttribute(attributeId);
                return attributeValue ?? "null";
            });
        } catch (err) {
            console.error(`Error evaluating attribute: ${attributeId}`);
            throw err;
        }
    }
}
