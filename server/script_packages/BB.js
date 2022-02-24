const BBItem = require('../models/BBItem');
const Stores = require('./Stores')
/*
interface Bestbuy{
    initURL(cp)
    async getItemSpec(page, url)
    async #openSpecWrapper(page)
    async #parseItemSpec(page)
    async #parsePageNumFooter(page)
    async closeDialog(page)
    async getPagesNum(page, url)
    async #parseItemsList(page)
    async getPageItems(page, url)
    
}
*/

class Bestbuy extends Stores {
    model = BBItem
    constructor() {
        super();
        this.url = 'https://www.bestbuy.com/site/searchpage.jsp?_dyncharset=UTF-8&browsedCategory=pcmcat138500050001&cp=1&id=pcat17071&iht=n&ks=960&list=y&qp=condition_facet%3DCondition~New&sc=Global&st=categoryid%24pcmcat138500050001&type=page&usc=All%20Categories'
    }
    initURL(cp) {
        return this.url.replace(/(&cp=)(\d+)/, "$1" + cp)
    }
    async getItemSpec(page, url) {
        await page.goto(url);
        await this.#openSpecWrapper(page);
        let itemSpec = await this.#parseItemSpec(page);
        return itemSpec;
    }
    async #openSpecWrapper(page) {
        let specWrapper = (await page.$x('//button[@data-track="Specifications: Accordion Open"]'))[0]
        specWrapper.click()
    }
    async #parseItemSpec(page) {
        const KEYS_XPATH_EXPR = '//div[@class="title-container col-xs-6 v-fw-medium"]/div'
        const VALUES_XPATH_EXPR = '//div[@class="row-value col-xs-6 v-fw-regular"]'
        let keys = await this.evaluateElementsText(page, KEYS_XPATH_EXPR)
        let values = await this.evaluateElementsText(page, VALUES_XPATH_EXPR)

        let spec = {}
        keys.forEach((key, index) => {
            // key= key.split(' ').join('')
            key = key.replace(/\s/g, "")
            spec[key] = values[index]
        })

        return spec
    }

    async #parsePageNumFooter(page) {
        let res = {
            numPerPage: undefined,
            totalNum: undefined
        };
        const FOOTER_XPATH_EXPR = '//div[@class="footer top-border wrapper"]//span'
        const NUM_PAGE_REGEX_EXPR = /\d*-(\d*)\sof\s\d*/
        const TOTAL_NUM_REGEX_EXPR = /.*of\s(\d*)\sitems/

        let footer = (await this.evaluateElementsText(page, FOOTER_XPATH_EXPR))[0]
        res.numPerPage = Number(this.getRegexValue(footer, NUM_PAGE_REGEX_EXPR))
        res.totalNum = Number(this.getRegexValue(footer, TOTAL_NUM_REGEX_EXPR))

        console.log(`[${this.constructor.name}][Parse Page Num Footer] numPerPage:${res.numPerPage}, totalNum:${res.totalNum}`)
        return res
    }

    async closeDialog(page) {

    }

    async getPagesNum(page, url) {
        await page.goto(url);
        let { totalNum, numPerPage } = await this.#parsePageNumFooter(page)
        return ({
            pagesNum: Math.ceil(totalNum / numPerPage),
            numPerPage: numPerPage
        })
    }

    async #parseItemsList(page) {
        const ITEMS_LIST_EXPR = '//li[@class="sku-item"]'
        const PRICE_LIST_EXPR = ITEMS_LIST_EXPR + '//div[@class="priceView-hero-price priceView-customer-price"]/span[@aria-hidden="true"]'
        const NAME_LIST_EXPR = ITEMS_LIST_EXPR + '//h4[@class="sku-header"]/a'
        const ITEM_ATTRIBUTE_ID = "data-sku-id"

        const siteLink = 'https://www.bestbuy.com/site/***sku***.p?skuId=***sku***'

        let itemAttrLists = await this.evaluateItemAttribute(page, ITEMS_LIST_EXPR, ITEM_ATTRIBUTE_ID)
        let priceTextLists = await this.evaluateElementsText(page, PRICE_LIST_EXPR)
        let nameLists = await this.evaluateElementsText(page, NAME_LIST_EXPR)
        return itemAttrLists.map((sku, index) => {
            let link = siteLink.replace(/\*\*\*sku\*\*\*/g, sku)
            let name = nameLists[index]
            let currentPrice = Number(priceTextLists[index].replace(/[\s|$|,]/g, ""))

            return ({
                link: link,
                sku: sku,
                currentPrice: currentPrice,
                name: name
            });
        })
    }

    async getPageItems(page, url) {
        let items;
        await page.goto(url)
        await page.waitForTimeout(10000);
        try {
            items = await this.#parseItemsList(page)
        } catch {
            await page.goto(url)
            items = await this.retry(() => this.#parseItemsList(page), 2000)
        }
        return items
    }

    retry(callback, milisec) {
        return new Promise((resolve, reject) => {
            let interval = setInterval(async () => {
                let res = await callback();
                console.log("retrying...")
                if (res) {
                    clearInterval(interval)
                    resolve(res)
                }
            }, milisec)

            setTimeout(() => {
                clearInterval(interval);
                reject()
            }, 10000)
        })
    }
}

module.exports = Bestbuy;