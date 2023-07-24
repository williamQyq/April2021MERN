import mongoose from 'mongoose';
import { DealsAlert, DealDataType } from '#query/deals.query';
import puppeteer, { Page } from 'puppeteer';
import { DealBot, DealMessage, MyMessage, Pagination } from './index';
import io from '#root/index';
import Scheduler from '#root/bin/helper/Scheduler';

/*
declare class Microsoft{
    initURL(skipItemsNum):url
    async getItemSpec(page:puppeteer<page>, url:URL): ItemSpec
    async #openSpecWrapper(page:puppeteer<page>):void
    async #parseItemSpec(page:puppeteer<page>): ItemSpec
    async #parsePageNumFooter(page:puppeteer<page>): PageNumFooter
    async closeDialog(page:puppeteer<page>):void
    async getPagesNum(page:puppeteer<page>, url:URL): PageNumFooter>
    async #parseItemsList(page:puppeteer<page>): Array<Item>
    async getPageItems(page:puppeteer<page>, url:URL): Array<Item>
    
}
*/
/* 
interface Item{
    link: url,
    sku: string,
    currentPrice: string,
    name: string
}
*/
/* 
interface ItemSpec{
    [key:string]:value:string
    ...
}
*/

/* 
interface PageNumFooter{
    numPerPage: number,
    totalNum: number
}

*/
interface DealEleAttribute {
    pid: string,
    cN: string,
    price: string
}
export default class Microsoft extends DealBot {
    storeName: string = "Microsoft";
    static url: string = 'https://www.microsoft.com/en-us/store/b/shop-all-pcs?categories=2+in+1||Laptops||Desktops||PC+Gaming&s=store&skipitems=';

    constructor() {
        super();
    }

    async getAndSaveLaptopsPrice() {
        const logger = new MyMessage();
        let alert = new DealsAlert({ logger, storeName: this.storeName });
        let model = DealsAlert._MicrosoftDeal;
        let storeUrl = this.editParamPageNumInUrl(0); //this. url + skipItemsNum
        let browser: puppeteer.Browser | undefined;
        let page: puppeteer.Page | undefined;
        try {
            browser = await this.initBrowser();
            page = await this.initPage(browser);

            // page.setDefaultNavigationTimeout(30000);

            let { pageCnt } = await this.getPagination(page, storeUrl);
            console.log('total pages num: ', pageCnt);

            if (!pageCnt) throw new Error("*Get Pagination failed.*");

            // Get Deals data and saved to database, for each deals retrieved print process status.

            for (let i = 0; i < pageCnt; i++) {
                let pageUrl = this.editParamPageNumInUrl(i * pageCnt);
                let dealsData: DealDataType[] | undefined = await this.getPageItems(page, pageUrl); //Array<{PromiseResolveType}>
                // let fulfilledDeals = dealsDataProms.filter(prom => prom.status === 'fulfilled' && prom.value.price !== undefined) as PromiseFulfilledResult<ParsedDealDataType>[];
                await alert.createMultiDeals(
                    dealsData as Required<DealDataType>[],
                    model
                )
                    .finally(() => logger.printPageEndLine({ storeName: this.storeName, index: i }))
            }
        } catch (e) {
            logger.printError(e);
            io.sockets.emit("RETRIEVE_MS_ITEMS_ONLINE_PRICE_ERROR", { msg: `Fail to retrive Bestbuy Laptop Price \n\n${e}` })
        }

        if (page) await page.close();
        if (browser) await browser.close();

        //notify browser
        io.sockets.emit("ON_RETRIEVED_MS_ITEMS_ONLINE_PRICE", { msg: "All deals retieved success" });
    }

    editParamPageNumInUrl(skipItemsNum: number): string {
        return Microsoft.url + skipItemsNum;
    }

    async parsePageNumFooter(page: Page): Promise<Pagination> {
        let pagination: Required<Pagination> | undefined = undefined;
        const logger = new MyMessage();

        const FOOTER_XPATH_EXPR = '//p[@class="c-paragraph-3"]'
        const NUM_PAGE_REGEX_EXPR: RegExp = /.*Showing\s\d*\s-\s(\d*)\sof\s\d*.*/;
        const TOTAL_NUM_REGEX_EXPR: RegExp = /.*Showing.*of\s(\d*).*/;

        let footer = (await this.evaluateElementsText(page, FOOTER_XPATH_EXPR))[0]
        if (!footer) throw new Error("footer element is evaluated as undefined.");

        let itemCntPerPage: number = Number(this.getRegexValue(footer, NUM_PAGE_REGEX_EXPR))
        let itemsCount: number = Number(this.getRegexValue(footer, TOTAL_NUM_REGEX_EXPR))

        pagination = {
            pageCnt: Math.ceil(itemsCount / itemCntPerPage),
            itemCntPerPage
        }

        logger.printPagination({ ...pagination, storeName: this.storeName })
        return pagination
    }

    async closeDialogIfAny(page: Page) {
        try {
            await page.waitForXPath('//div[@class="sfw-dialog"]/div[@class="c-glyph glyph-cancel"]')
            let dialogCloseBtn = (await page.$x('//div[@class="sfw-dialog"]/div[@class="c-glyph glyph-cancel"]'))[0]
            await dialogCloseBtn.click()
        } catch (e) {
            console.error(`${this.constructor.name}: no dialog shows up, skipping.`)
        }
    }

    /* 
    @param: page:Puppeteer<page>
    @param: url: string
    @return: PageNumFooter
    */
    async getPagination(page: Page, url: string): Promise<Pagination> {
        await page.goto(url);
        await this.closeDialogIfAny(page)    //may or may not close the dialog, it depends if the dialog shows up.
        let pagination: Pagination = await this.parsePageNumFooter(page)

        return pagination;
    }

    /* 
        @param: page:Puppeteer<page>
        @param: url: string
        @return: Array<Item>
    */
    async parseItemsList(page: Page): Promise<DealDataType[]> {
        const ITEM_ELEMENTS_EXPR = '//div[@class="m-channel-placement-item f-wide f-full-bleed-image"]'
        const PRICE_SPAN_EXPR = 'span[itemprop="price"]'
        const IS_INSTOCK_EXPR = 'strong[class="c-badge f-small f-lowlight x-hidden-focus"]'
        const ITEM_ATTRIBUTE_ID = "data-m"
        const PRICE_ATTRIBUTE_ID = "content"

        // let itemAttrLists = await this.evaluateItemAttribute(page, ITEMS_LIST_EXPR, ITEM_ATTRIBUTE_ID)
        // let priceAttrLists = await this.evaluatePriceAttribute(page, PRICE_LIST_EXPR, PRICE_ATTRIBUTE_ID)

        await page.waitForXPath(ITEM_ELEMENTS_EXPR);
        const itemElements = await page.$x(ITEM_ELEMENTS_EXPR);
        // let itemElements = await page.$$('div.m-channel-placement-item f-wide f-full-bleed-image');

        const deals = await Promise.allSettled<Promise<DealDataType>[]>(
            itemElements.map(async (ele) => {
                let price: number, isInStock: boolean;

                const attributeResult = await this.evaluateOneElementAttribute({ element: ele, attributeId: ITEM_ATTRIBUTE_ID, selector: "a" });
                const priceText = await this.evaluateOneElementAttribute({ element: ele, attributeId: PRICE_ATTRIBUTE_ID, selector: PRICE_SPAN_EXPR });
                isInStock = await ele.$eval<boolean>(IS_INSTOCK_EXPR, (el) => {
                    return el.textContent !== "OUT OF STOCK";
                });
                price = Number(priceText.replace(/[$|,]/g, ""));
                let data: DealEleAttribute;
                try {
                    data = JSON.parse(attributeResult);
                    return {
                        sku: data.pid,
                        currentPrice: price,
                        name: data.cN,
                        link: 'https://www.microsoft.com/en-us/d/' + data.cN.replace(/\s/g, "-").replace(/"/g, "").toLowerCase() + '/' + data.pid,
                        isInStock
                    };
                } catch (err) {
                    console.error("Failed to parse deal data attribute.");
                    throw err;
                }
            }));

        //TODO: fulfilledDeals unfinished
        const fulfilledDeals = deals.filter(prom => prom.status === "fulfilled" && prom.value.currentPrice) as PromiseFulfilledResult<DealDataType>[];
        return deals;
    }
    /* 
        @param: page:Puppeteer<page>
        @param: url: string
        @return: Array<Item>
    */
    async getPageItems(page: Page, url: string, options?: { retry: boolean }): Promise<DealDataType[]> {
        await page.goto(url)
        // await page.waitForTimeout(10000);
        let deals = await this.parseItemsList(page);

        return deals;
    }

    startScheduler(): void {
        const sc = new Scheduler({
            schedule: '00 00 08 * * *',
            process: this.getAndSaveLaptopsPrice
        });

        sc.start();
    }
}
