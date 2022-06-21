import { AlertApi } from '../../lib/query/utilities.js';
import Stores from './Stores.js';

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

export default class Microsoft extends Stores {
    constructor() {
        super();
        this.url = 'https://www.microsoft.com/en-us/store/b/shop-all-pcs?categories=2+in+1||Laptops||Desktops||PC+Gaming&s=store&skipitems=';
    }

    async getAndSaveMicrosoftLaptopsPrice() {
        let erpApi = new AlertApi();
        let databaseModel = erpApi.getMicrosoftAlertModel();
        let storeUrl = this.initURL(0); //this. url + skipItemsNum

        let browser = await this.initBrowser();
        let page = await this.initPage(browser);
        await page.setDefaultNavigationTimeout(30000);

        let { pagesNum, numPerPage } = await this.getPagesNum(page, storeUrl);
        console.log('total pages num: ', pagesNum);
        try {
            for (let i = 0; i < pagesNum; i++) {
                let pageUrl = this.initURL(i * numPerPage);
                let items = await this.getPageItems(page, pageUrl); //ItemType { link, sku, currentPrice, name }
                await Promise.all(items.map((item, index) =>
                    erpApi.saveStoreItemToDatabase(item, databaseModel).then((result) =>
                        this.printMsg(new Map(
                            Object.entries({
                                store: Microsoft.name,
                                page: i,
                                index: index,
                                sku: item.sku,
                                currentPrice: item.currentPrice,
                                result: result
                            })  //printMsg received a Map of msgObj
                        ))
                    )
                ))
                    .finally(() => {
                        console.log(`[${Microsoft.name}]===Page ${i} finished.===`)
                    })
            }
            await page.close();
            await browser.close();
        } catch (e) {
            await page.close();
            await browser.close()
            console.error(`\nERROR:[${Microsoft.name}] Ended with exception.\n`, e.message)
            throw new Error(e.message);
        }

    }

    initURL(skipItemsNum) {
        return this.url + skipItemsNum
    }

    async #parsePageNumFooter(page) {
        let res = {
            numPerPage: undefined,
            totalNum: undefined
        };
        const FOOTER_XPATH_EXPR = '//p[@class="c-paragraph-3"]'
        const NUM_PAGE_REGEX_EXPR = /.*Showing\s\d*\s-\s(\d*)\sof\s\d*.*/
        const TOTAL_NUM_REGEX_EXPR = /.*Showing.*of\s(\d*).*/

        let footer = (await this.evaluateElementsText(page, FOOTER_XPATH_EXPR))[0]
        res.numPerPage = Number(this.getRegexValue(footer, NUM_PAGE_REGEX_EXPR))
        res.totalNum = Number(this.getRegexValue(footer, TOTAL_NUM_REGEX_EXPR))

        console.log(`[${this.constructor.name}][Parse Page Num Footer] numPerPage:${res.numPerPage}, totalNum:${res.totalNum}`)
        return res
    }

    async #closeDialogIfAny(page) {
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
    async getPagesNum(page, url) {
        await page.goto(url);
        await this.#closeDialogIfAny(page)    //may or may not close the dialog, it depends if the dialog shows up.
        let res = await this.#parsePageNumFooter(page)

        let pageNumFooter = {
            pagesNum: Math.ceil(res.totalNum / res.numPerPage),
            numPerPage: res.numPerPage
        }

        return pageNumFooter
    }

    /* 
        @param: page:Puppeteer<page>
        @param: url: string
        @return: Array<Item>
    */
    async #parseItemsList(page) {
        const ITEMS_LIST_EXPR = '//div[@class="m-channel-placement-item f-wide f-full-bleed-image"]/a'
        const PRICE_LIST_EXPR = '//span[@itemprop="price"]'
        const ITEM_ATTRIBUTE_ID = "data-m"
        const PRICE_ATTRIBUTE_ID = "content"

        let itemAttrLists = await this.evaluateItemAttribute(page, ITEMS_LIST_EXPR, ITEM_ATTRIBUTE_ID)
        let priceAttrLists = await this.evaluatePriceAttribute(page, PRICE_LIST_EXPR, PRICE_ATTRIBUTE_ID)
        let itemsArray = itemAttrLists.map((item, index) => {
            item = JSON.parse(item)
            let sku = item['pid']
            let name = item["tags"]["prdName"]
            let link = 'https://www.microsoft.com/en-us/d/' + name.replace(/\s/g, "-").replace(/"/g, "").toLowerCase() + '/' + sku
            let currentPrice = priceAttrLists[index]

            let itemObj = {
                link,
                sku,
                currentPrice,
                name
            }
            return itemObj;
        })
        return itemsArray
    }
    /* 
        @param: page:Puppeteer<page>
        @param: url: string
        @return: Array<Item>
    */
    async getPageItems(page, url) {
        await page.goto(url)
        // await page.waitForTimeout(10000);

        let items = await this.#parseItemsList(page)
        return items
    }


    async getItemSpec(page, url) {
        return
    }
}
