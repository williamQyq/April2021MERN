const MSItem = require('../models/MsItem');
const Stores = require('./Stores');

/*
interface Microsoft{
    initURL(skipItemsNum)->URL
    async getItemSpec(page:puppeteer<page>, url:URL)-> Object<ItemSpec>
    async #openSpecWrapper(page:puppeteer<page>)-> Null
    async #parseItemSpec(page:puppeteer<page>)->Object<ItemSpec>
    async #parsePageNumFooter(page:puppeteer<page>)->Object<PageNumFooter>
    async closeDialog(page:puppeteer<page>)-> Null
    async getPagesNum(page:puppeteer<page>, url:URL)->Object<PageNumFooter>
    async #parseItemsList(page:puppeteer<page>)->Object<StoreItems>
    async getPageItems(page:puppeteer<page>, url:URL)->Object<StoreItems>
    
}
*/

class Microsoft extends Stores {
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

    async closeDialog(page) {
        let dialogCloseBtn = (await page.$x('//div[@class="sfw-dialog"]/div[@class="c-glyph glyph-cancel"]'))[0]
        dialogCloseBtn.click()
    }

    async getPagesNum(page, url) {
        await page.goto(url);
        try {
            await this.closeDialog(page)    //may or may not close the dialog, it depends if the dialog shows up.
        } catch (e) {
            console.error(`${this.constructor.name}\n`, e)
        }
        let res = await this.#parsePageNumFooter(page)
        return ({
            pagesNum: Math.ceil(res.totalNum / res.numPerPage),
            numPerPage: res.numPerPage
        })
    }

    async #parseItemsList(page) {
        const ITEMS_LIST_EXPR = '//div[@class="m-channel-placement-item f-wide f-full-bleed-image"]/a'
        const PRICE_LIST_EXPR = '//span[@itemprop="price"]'
        const ITEM_ATTRIBUTE_ID = "data-m"
        const PRICE_ATTRIBUTE_ID = "content"

        let itemAttrLists = await this.evaluateItemAttribute(page, ITEMS_LIST_EXPR, ITEM_ATTRIBUTE_ID)
        let priceAttrLists = await this.evaluatePriceAttribute(page, PRICE_LIST_EXPR, PRICE_ATTRIBUTE_ID)
        return itemAttrLists.map((item, index) => {
            let pid = item['pid']
            let name = item["tags"]["prdName"]
            let link = 'https://www.microsoft.com/en-us/d/' + name.replace(/\s/g, "-").replace(/"/g, "").toLowerCase() + '/' + pid
            let currentPrice = Number(priceAttrLists[index])

            return ({
                link: link,
                sku: pid,
                currentPrice: currentPrice,
                name: name
            });
        })
    }

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

module.exports = Microsoft