const puppeteer = require('puppeteer');
const { USER_AGENT } = require('../config/puppeteerConfig.js');
const BBItem = require('../models/BBItem')
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
    async evaluateElementsText(page, xpath_expr) {
        await page.waitForXPath(xpath_expr)
        const elements = await page.$x(xpath_expr)
        return await page.evaluate((...elements) =>
            (elements.map(e => e.textContent))
            , ...elements)
    }
}

class Microsoft extends Stores {
    constructor() {
        super();
        this.url = {
            base: 'https://www.microsoft.com/en-us/store/b/shop-all-pcs?categories=2+in+1||Laptops||Desktops||PC+Gaming&s=store&skipitems=',
            skipItemsNum: 0
        }
        this.model = MSItem
    }
    async getPagesNum() {

    }
    async getItems() {
        await this.page.goto(this.url + this.skipItemsNum)
        await this.page.waitForTimeout(10000);
        // await this.page.waitForXPath()
        await this.page.close();
        await this.browser.close();
    }
}

class Bestbuy extends Stores {
    constructor() {
        super();
        this.url = {
            head: 'https://www.bestbuy.com/site/searchpage.jsp?_dyncharset=UTF-8&browsedCategory=pcmcat138500050001&cp=',
            tail: '&id=pcat17071&iht=n&ks=960&list=y&qp=condition_facet%3DCondition~New&sc=Global&st=categoryid%24pcmcat138500050001&type=page&usc=All%20Categories',
            cp: 1
        }
        this.model = BBItem
    }
    async getItemSpec(page, url) {
        await page.goto(url);
        await this.#openSpecWrapper(page);
        let itemSpec = await this.#parseItemSpec(page);
        return itemSpec;
    }
    async #openSpecWrapper(page) {
        const specWrapper = (await page.$x('//button[@data-track="Specifications: Accordion Open"]'))[0]
        specWrapper.click()
    }
    async #parseItemSpec(page) {
        const keys_xpath_expr = '//div[@class="title-container col-xs-6 v-fw-medium"]/div'
        const values_xpath_expr = '//div[@class="row-value col-xs-6 v-fw-regular"]'
        const keys = await this.evaluateElementsText(page, keys_xpath_expr)
        const values = await this.evaluateElementsText(page, values_xpath_expr)

        let spec = {}
        keys.forEach((key, index) => {
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