const puppeteer = require('puppeteer');
const { USER_AGENT } = require('../config/puppeteerConfig.js');
const BBItem = require('../models/BBItem')
const MSItem = require('../models/MsItem');

class Stores {
    constructor(model) {
        this.model = model;
    }
    async initBrowser() {
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
            ],
        });
        this.browser = browser;
    }
    async initPage() {
        const page = await this.browser.newPage();
        await page.setUserAgent(USER_AGENT);
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (req.resourceType() === 'image') {
                req.abort();
            } else {
                req.continue();
            }
        });
        if(this.url)
        this.page = page
    }

}

class Microsoft extends Stores {
    constructor(model = MSItem) {
        super(model);
        this.url = {
            base:'https://www.microsoft.com/en-us/store/b/shop-all-pcs?categories=2+in+1||Laptops||Desktops||PC+Gaming&s=store&skipitems=',
            skipItemsNum:0
        }
    }
    async getPagesNum(){

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
    constructor(model = BBItem) {
        super(model);
        this.url = {
            head:'https://www.bestbuy.com/site/searchpage.jsp?_dyncharset=UTF-8&browsedCategory=pcmcat138500050001&cp=',
            tail:'&id=pcat17071&iht=n&ks=960&list=y&qp=condition_facet%3DCondition~New&sc=Global&st=categoryid%24pcmcat138500050001&type=page&usc=All%20Categories',
            cp: 1
        }
    }
    async getPagesNum(){

    }

    async getItems() {
        await this.page.goto(this.url + this.skipItemsNum)
        await this.page.waitForTimeout(10000);
        await this.page.close();
        await this.browser.close();
    }
}

module.exports = {
    Stores,
    Microsoft,
    Bestbuy
}