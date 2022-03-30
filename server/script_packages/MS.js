import MSItem from '../models/MsItem.js';
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
    model = MSItem
    constructor() {
        super();
        this.url = 'https://www.microsoft.com/en-us/store/b/shop-all-pcs?categories=2+in+1||Laptops||Desktops||PC+Gaming&s=store&skipitems=';
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
        await page.waitForTimeout(10000);

        let items = await this.#parseItemsList(page)
        return items
    }


    async getItemSpec(page, url) {
        return
    }
}
