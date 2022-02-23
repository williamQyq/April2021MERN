const puppeteer = require('puppeteer');
const { ip } = require('config');
const BBItem = require('../models/BBItem');
const MSItem = require('../models/MsItem');

class Stores {
    constructor() {
    }
    async initBrowser() {
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
            ],
        });
        return browser;
    }
    async initPage(browser) {
        const page = await browser.newPage();
        await page.setUserAgent(ip.USER_AGENT);
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
            (elements.map(e => JSON.parse(e.getAttribute(ATTRIBUTE_ID))))
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

class Bestbuy extends Stores {
    model = BBItem
    constructor() {
        super();
        this.url = {
            head: 'https://www.bestbuy.com/site/searchpage.jsp?_dyncharset=UTF-8&browsedCategory=pcmcat138500050001&cp=',
            tail: '&id=pcat17071&iht=n&ks=960&list=y&qp=condition_facet%3DCondition~New&sc=Global&st=categoryid%24pcmcat138500050001&type=page&usc=All%20Categories',
            cp: 1
        }
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
}

module.exports = {
    Stores,
    Microsoft,
    Bestbuy
}