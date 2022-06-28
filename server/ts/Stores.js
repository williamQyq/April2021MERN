import puppeteer from 'puppeteer';
// import MSItem from '../models/MsItem';
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.0 Safari/537.36";
export class Stores {
    constructor() {
    }
    async initBrowser() {
        const browser = await puppeteer.launch({
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
        await page.setUserAgent(USER_AGENT);
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
export class BestBuy extends Stores {
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
