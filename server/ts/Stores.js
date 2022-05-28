"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BestBuy = exports.Stores = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const config_json_1 = require("./config/config.json");
class Stores {
    constructor() {
    }
    async initBrowser() {
        const browser = await puppeteer_1.default.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--window-size=1920,1080'
            ],
        });
        return browser;
    }
    async initPage(browser) {
        const page = await browser.newPage();
        await page.setUserAgent(config_json_1.USER_AGENT);
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (req.resourceType() === 'image') {
                req.abort();
            }
            else {
                req.continue();
            }
        });
        return page;
    }
}
exports.Stores = Stores;
class Microsoft extends Stores {
    // private model: typeof MsItem;
    url;
    constructor() {
        super();
        this.url = {
            base: 'https://www.microsoft.com/en-us/store/b/shop-all-pcs?categories=2+in+1||Laptops||Desktops||PC+Gaming&s=store&skipitems=',
            skipItemsNum: 0
        };
    }
    async getPageContext() {
        let pageContext = {
            pageNumber: 1,
            itemNumEachPage: 1
        };
        return pageContext;
    }
    async pipeAndSaveItems() {
        // await this.page.goto(this.url.base + this.url.skipItemsNum)
        // await this.page.waitForTimeout(10000);
        // // await this.page.waitForXPath()
        // await this.page.close();
        // await this.browser.close();
    }
    async getItemSpecByUri(uri) {
        return {};
    }
}
class BestBuy extends Stores {
    // private model: typeof BBItem
    url;
    constructor() {
        super();
        this.url = {
            head: 'https://www.bestbuy.com/site/searchpage.jsp?_dyncharset=UTF-8&browsedCategory=pcmcat138500050001&cp=',
            tail: '&id=pcat17071&iht=n&ks=960&list=y&qp=condition_facet%3DCondition~New&sc=Global&st=categoryid%24pcmcat138500050001&type=page&usc=All%20Categories',
            cp: 1
        };
    }
    async getPageContext() {
        let pageContext = {
            pageNumber: 1,
            itemNumEachPage: 1
        };
        return pageContext;
    }
    async pipeAndSaveItems() {
        return;
    }
    async getItemSpecByUri(uri) {
        return {};
    }
    test() {
        console.log(`typescript test`);
    }
}
exports.BestBuy = BestBuy;
