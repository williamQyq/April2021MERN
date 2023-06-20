import mongoose from 'mongoose';
import { DealsAlert, DealDataType } from '#query/deals.query';
import puppeteer, { Page } from 'puppeteer';
import { DealBot, DealMessage, MyMessage, Pagination } from './index';

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
interface ParsedDealDataType {
    price: number;
    isInStock: boolean;
    pid: string;
    cN: string;
}
export default class Microsoft extends DealBot {
    storeName: string = "Microsoft";
    static url: string = 'https://www.microsoft.com/en-us/store/b/shop-all-pcs?categories=2+in+1||Laptops||Desktops||PC+Gaming&s=store&skipitems=';

    constructor() {
        super();
    }

    async getAndSaveLaptopsPrice() {
        let alert = new DealsAlert();
        let model = DealsAlert._MicrosoftDeal;
        let storeUrl = this.editParamPageNumInUrl(0); //this. url + skipItemsNum
        let browser: puppeteer.Browser | undefined;
        let page: puppeteer.Page | undefined;
        try {
            browser = await this.initBrowser();
            page = await this.initPage(browser);

            page.setDefaultNavigationTimeout(30000);

            let { pageCnt } = await this.getPagination(page, storeUrl);
            console.log('total pages num: ', pageCnt);

            if (!pageCnt) throw new Error("*Get Pagination failed.*");

            // Get Deals data and saved to database, for each deals retrieved print process status.

            for (let i = 0; i < pageCnt; i++) {
                let pageUrl = this.editParamPageNumInUrl(i * pageCnt);
                let dealsDataProms: PromiseSettledResult<ParsedDealDataType>[] = await this.getPageItems(page, pageUrl); //Array<{PromiseResolveType}>
                let fulfilledDeals = dealsDataProms.filter(prom => prom.status === 'fulfilled' && prom.value.price !== undefined) as PromiseFulfilledResult<ParsedDealDataType>[];
                await Promise.all(
                    fulfilledDeals.map((fulfilledDeal: PromiseFulfilledResult<ParsedDealDataType>, index: number) => {
                        const { pid, cN, price } = fulfilledDeal.value;
                        let deal: DealDataType = {
                            sku: pid,
                            name: cN,
                            link: 'https://www.microsoft.com/en-us/d/' + cN.replace(/\s/g, "-").replace(/"/g, "").toLowerCase() + '/' + pid,
                            currentPrice: price
                        }
                        alert.createDeal(deal, model).then(status => {
                            let dealMsgContent: DealMessage = {
                                storeName: Microsoft.name,
                                indexPage: i,
                                index,
                                sku: deal.sku ? deal.sku : "",
                                currentPrice: deal.currentPrice,
                                status
                            }
                            let msg = new MyMessage(this.storeName);
                            msg.printGetDealMsg(dealMsgContent);
                        });
                    }))
                    .finally(() => {
                        //print split line.
                        let finalMsg = new MyMessage(this.storeName);
                        finalMsg.printPageEndLine(i);
                    })
            }
        } catch (e) {
            let errMsg = new MyMessage(this.storeName);
            errMsg.printError(e);
        }

        if (page) await page.close();
        if (browser) await browser.close();
    }

    editParamPageNumInUrl(skipItemsNum: number): string {
        return Microsoft.url + skipItemsNum;
    }

    async parsePageNumFooter(page: Page): Promise<Pagination> {
        let pagination: Pagination | undefined = undefined;

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

        let parsingMsg = new MyMessage(this.storeName);
        parsingMsg.printPagination(pagination.pageCnt!, pagination.itemCntPerPage!);

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
    async parseItemsList(page: Page): Promise<PromiseSettledResult<ParsedDealDataType>[]> {
        const ITEM_ELEMENTS_EXPR = '//div[@class="m-channel-placement-item f-wide f-full-bleed-image"]'
        const PRICE_SPAN_EXPR = 'span[itemprop="price"]'
        const IS_INSTOCK_EXPR = 'strong[class="c-badge f-small f-lowlight x-hidden-focus"]'
        const ITEM_ATTRIBUTE_ID = "data-m"
        const PRICE_ATTRIBUTE_ID = "content"

        // let itemAttrLists = await this.evaluateItemAttribute(page, ITEMS_LIST_EXPR, ITEM_ATTRIBUTE_ID)
        // let priceAttrLists = await this.evaluatePriceAttribute(page, PRICE_LIST_EXPR, PRICE_ATTRIBUTE_ID)

        await page.waitForXPath(ITEM_ELEMENTS_EXPR);
        let itemElements = await page.$x(ITEM_ELEMENTS_EXPR);
        // let itemElements = await page.$$('div.m-channel-placement-item f-wide f-full-bleed-image');

        let deals = await Promise.allSettled<Promise<ParsedDealDataType>[]>(itemElements.map(async (ele) => {
            let price: number | undefined = undefined, isInStock: boolean = true;
            try {
                let attrRes = await ele.$eval<string>('a', (ele, ITEM_ATTRIBUTE_ID: unknown) => {
                    const attributeValue = ele.getAttribute(ITEM_ATTRIBUTE_ID as string);
                    return attributeValue !== null ? attributeValue : "null";
                }, ITEM_ATTRIBUTE_ID);

                let data = JSON.parse(attrRes)//JSON text data-m attribute to JSON object

                //unable to get deal data:
                if (data == null) throw new Error("*Fail to parse deal data attr*");

                let priceText = await ele.$eval<string>(PRICE_SPAN_EXPR, (span: Element, PRICE_ATTRIBUTE_ID: unknown) => {
                    const priceAttribute = span.getAttribute(PRICE_ATTRIBUTE_ID as string);
                    return priceAttribute !== null ? priceAttribute : "null";
                }, PRICE_ATTRIBUTE_ID);

                price = Number(priceText.replace(/[$|,]/g, ""));

                let isInStockText: string = await ele.$eval<string>(IS_INSTOCK_EXPR, (el) => {
                    let isInStockText = el.textContent;
                    return isInStockText !== null ? isInStockText : "";
                });
                isInStock = isInStockText === "OUT OF STOCK" ? false : true;

                //found price and currently instock
                return { ...data, price, isInStock };

            } catch (err) {
                //if no OUT OF STOCK tag do nothing...
                console.error("parseItemLists Error.")
            }
        }));

        return deals;
    }
    /* 
        @param: page:Puppeteer<page>
        @param: url: string
        @return: Array<Item>
    */
    async getPageItems(page: Page, url: string) {
        await page.goto(url)
        // await page.waitForTimeout(10000);
        let deals = await this.parseItemsList(page)
        return deals;
    }


    // async getItemSpec(page:Page, url:string) {
    //     return
    // }
}
