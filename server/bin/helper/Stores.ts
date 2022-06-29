import puppeteer, { Browser, Page } from 'puppeteer';

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.0 Safari/537.36";
type PageContext = {
    pageNumber: number
    itemNumEachPage: number
}


interface StoresInterface {
    initBrowser(): Promise<Browser>;
    initPage(browser: Browser): Promise<Page>;
}

interface SubStoreInterface extends StoresInterface {
    getPageContext(): Promise<PageContext>;
    pipeAndSaveItems(): Promise<void>;
    getItemSpecByUri(uri: URL): Promise<Object>;

}

export class Stores implements StoresInterface {

    constructor() {
    }
    async initBrowser(): Promise<Browser> {
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
    async initPage(browser: Browser): Promise<Page> {
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
        return page;
    }

}

class Microsoft extends Stores implements SubStoreInterface {
    // private model: typeof MsItem;
    public url: {
        base: string,
        skipItemsNum: number
    }
    constructor() {
        super();
        this.url = {
            base: 'https://www.microsoft.com/en-us/store/b/shop-all-pcs?categories=2+in+1||Laptops||Desktops||PC+Gaming&s=store&skipitems=',
            skipItemsNum: 0
        }
    }
    async getPageContext(): Promise<PageContext> {
        let pageContext = {
            pageNumber: 1,
            itemNumEachPage: 1
        }
        return pageContext;
    }
    async pipeAndSaveItems(): Promise<void> {
        // await this.page.goto(this.url.base + this.url.skipItemsNum)
        // await this.page.waitForTimeout(10000);
        // // await this.page.waitForXPath()
        // await this.page.close();
        // await this.browser.close();
    }
    async getItemSpecByUri(uri: URL): Promise<Object> {
        return {}
    }
}

export class BestBuy extends Stores implements SubStoreInterface {
    // private model: typeof BBItem
    public url: {
        head: string,
        tail: string,
        cp: number
    }
    constructor() {
        super();
        this.url = {
            head: 'https://www.bestbuy.com/site/searchpage.jsp?_dyncharset=UTF-8&browsedCategory=pcmcat138500050001&cp=',
            tail: '&id=pcat17071&iht=n&ks=960&list=y&qp=condition_facet%3DCondition~New&sc=Global&st=categoryid%24pcmcat138500050001&type=page&usc=All%20Categories',
            cp: 1
        }
    }
    async getPageContext(): Promise<PageContext> {
        let pageContext = {
            pageNumber: 1,
            itemNumEachPage: 1
        }
        return pageContext;
    }
    async pipeAndSaveItems(): Promise<void> {
        return
    }

    async getItemSpecByUri(uri: URL): Promise<Object> {
        return {

        }
    }
    test(): void {
        console.log(`typescript test`)
    }
}
