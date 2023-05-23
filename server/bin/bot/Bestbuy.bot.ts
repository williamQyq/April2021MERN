import mongoose from 'mongoose';
import { DealDataType, DealItemSpec, DealsAlert } from '#query/deals.query';
import { DealBot, DealMessage, MyMessage, Pagination } from './index';
import puppeteer, { Page } from 'puppeteer';
import io from 'index';

/*
declare class Bestbuy {
    public  initURL(cp):url
    public  async getItemSpec(page, url):Array<ItemSpec>
    private async #openSpecWrapper(page):void
    private async #parseItemSpec(page):ItemSpec
    private async #parsePageNumFooter(page):PageNumFooter
    public  async closeDialog(page):void
    public  async getPagesNum(page, url):PageNumFooter
    private async #parseItemsList(page): Array<Item>
    public  async getPageItems(page, url):Array<Item>

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
    [key:string]: string
    ...
}
*/

export default class Bestbuy extends DealBot {
    storeName: string = "Bestbuy";
    static url: string = 'https://www.bestbuy.com/site/searchpage.jsp?_dyncharset=UTF-8&browsedCategory=pcmcat138500050001&cp=1&id=pcat17071&iht=n&ks=960&list=y&qp=condition_facet%3DCondition~New&sc=Global&st=categoryid%24pcmcat138500050001&type=page&usc=All%20Categories';
    constructor() {
        super();
    }

    async getAndSaveLaptopsPrice() {
        let alert = new DealsAlert();
        const model = DealsAlert._BestbuyDeal;
        let storeUrl = this.editParamPageNumInUrl(1);
        let browser: puppeteer.Browser | undefined;
        let page: puppeteer.Page | undefined;

        try {
            browser = await this.initBrowser();
            page = await this.initPage(browser);

            const { pageCnt }: Pagination = await this.getPagination(page, storeUrl);
            console.log(`pageCnt:`, pageCnt);
            if (!pageCnt) throw new Error("*Parse Pagination fail*")
            // For each page, get deals, save to database and print process status. 

            // @TODO: use multi tab to crawl, instead one tab per page...

            for (let i = 0; i < pageCnt; i++) {
                // page = await this.initPage(browser);
                let pageUrl = this.editParamPageNumInUrl(i + 1);
                let dealsData: DealDataType[] | undefined = await this.getPageItems(page, pageUrl); //ItemType { link, sku, currentPrice, name }

                if (!dealsData) throw new Error("Fail to retrieve deals data.");

                await Promise.all(dealsData.map((deal: DealDataType, index: number) =>
                    alert.createDeal(deal, model as mongoose.Model<unknown>)
                        .then((status: string) => {
                            let dealMsg: DealMessage = {
                                storeName: Bestbuy.name,
                                indexPage: i,
                                index,
                                sku: deal.sku ? deal.sku : "",
                                currentPrice: deal.currentPrice ? deal.currentPrice : undefined,
                                status
                            }
                            let msg = new MyMessage(this.storeName);
                            msg.printGetDealMsg(dealMsg); //print deal message.
                        })
                ))
                    .finally(() => {
                        let finalMsg = new MyMessage(this.storeName);
                        finalMsg.printPageEndLine(i);
                    });
            }
        } catch (e) {
            let errMsg = new MyMessage(this.storeName);
            errMsg.printError(e);
            io.sockets.emit("RETRIEVE_BB_ITEMS_ONLINE_PRICE_ERROR", { msg: `Fail to retrive Bestbuy Laptop Price \n\n${e}` })
        }

        if (page) await page.close();
        if (browser) await browser.close();

        io.sockets.emit("ON_RETRIEVED_BB_ITEMS_ONLINE_PRICE", { msg: "All deals retieved success" });
    }

    async fetchAndSaveItemSpecification(url: string, sku: string) {
        let deals = new DealsAlert();

        console.log(`[getItemConfig] starting...`)
        let browser = await this.initBrowser();
        let page = await this.initPage(browser);
        let spec: DealItemSpec = await this.getItemSpec(page, url)

        await page.close();
        await browser.close();
        console.log(`[getItemConfiguration]:\n${JSON.stringify(spec, null, 4)}`)

        await deals.upsertItemConfiguration(spec, sku);

        return spec

    }

    editParamPageNumInUrl(changePage: number) {
        return Bestbuy.url.replace(/(&cp=)(\d+)/, "$1" + changePage)
    }

    /* 
    @param: page:Puppeteer<page>
    @param: url:string
    @return: itemSpec:ItemSpec
    */
    async getItemSpec(page: Page, url: string) {
        await page.goto(url);
        await this.openSpecWrapper(page);
        let itemSpec = await this.parseItemSpec(page);
        return itemSpec;
    }
    async openSpecWrapper(page: Page): Promise<void> {
        let specWrapper = (await page.$x('//div[@class="specs-container specs-wrapper all-specs-wrapper"]'))[0]
        specWrapper.click()
    }
    async parseItemSpec(page: Page): Promise<Map<string, string>> {
        const KEYS_XPATH_EXPR = '//div[@class="row-title"]'
        const VALUES_XPATH_EXPR = '//div[contains(@class,"row-value")]'
        let keys = await this.evaluateElementsText(page, KEYS_XPATH_EXPR)
        let values = await this.evaluateElementsText(page, VALUES_XPATH_EXPR)

        let spec = new Map();
        keys.forEach((key, index) => {
            // key= key.split(' ').join('')
            key = key.replace(/\s/g, "");
            spec.set(key, values[index]);
        })

        return spec
    }

    /* 
    @param: page:Puppeteer<page>
    @return: PageNumFooter
    */
    async parsePageNumFooter(page: Page): Promise<Pagination> {
        let pagination: Pagination = {
            itemCntPerPage: undefined,
            pageCnt: undefined
        };
        const FOOTER_XPATH_EXPR = '//div[@class="footer top-border wrapper"]//span'
        const NUM_PAGE_REGEX_EXPR: RegExp = /\d*-(\d*)\sof\s\d*/;
        const TOTAL_NUM_REGEX_EXPR: RegExp = /.*of\s(\d*)\sitems/

        let footer: string = (await this.evaluateElementsText(page, FOOTER_XPATH_EXPR))[0]
        let itemCntPerPage: number = Number(this.getRegexValue(footer, NUM_PAGE_REGEX_EXPR))
        let itemsCount: number = Number(this.getRegexValue(footer, TOTAL_NUM_REGEX_EXPR))

        pagination.pageCnt = Math.ceil(itemsCount / itemCntPerPage);
        pagination.itemCntPerPage = itemCntPerPage;

        let parsingMsg = new MyMessage(this.storeName);
        parsingMsg.printPagination(pagination.pageCnt, pagination.itemCntPerPage);

        return pagination;
    }

    /* 
    @param: page:Puppeteer<page>
    @param: url: string
    @return: PageNumFooter
    */
    async getPagination(page: Page, url: string): Promise<Pagination> {
        await page.goto(url);
        let pagination: Pagination = await this.parsePageNumFooter(page)
        // can't remember why is the page count need to be recalculate.

        return pagination;
    }
    /* 
        @param: page:Puppeteer<page>
        @return: itemsArray:Array<Item>
        @access: private
    */
    async parseItemsList(page: Page): Promise<DealDataType[]> {
        const SKU_LIST_EXPR = '//li[@class="sku-item"]'
        const PRICE_LIST_EXPR = SKU_LIST_EXPR + '//div[@class="priceView-hero-price priceView-customer-price"]/span[@aria-hidden="true"]'
        const NAME_LIST_EXPR = SKU_LIST_EXPR + '//h4[@class="sku-title"]/a'
        const SKU_ATTRIBUTE_ID = "data-sku-id"

        let skuAttrLists = await this.evaluateItemAttribute(page, SKU_LIST_EXPR, SKU_ATTRIBUTE_ID)
        let priceTextLists = await this.evaluateElementsText(page, PRICE_LIST_EXPR)
        let nameLists = await this.evaluateElementsText(page, NAME_LIST_EXPR)

        //Parsed Array<Item>
        let itemsArray = skuAttrLists.map((sku: string, index: number) => {
            let link = this.generateSiteLink(sku);
            let currentPrice = this.validatePrice(priceTextLists[index])
            let name = nameLists[index]

            let item: DealDataType = { link, sku, currentPrice, name }
            return item;
        })

        return itemsArray;
    }

    generateSiteLink(sku: string): string {
        return (`https://api.bestbuy.com/click/-/${sku}/pdp`)
    }
    validatePrice(priceText: string): number {
        return Number(priceText.replace(/[\s|$|,]/g, ""))
    }

    /* 
    @param: page: Puppeteer<page>
    @param: url: string
    @return: items: Array<Item>
    */
    async getPageItems(page: Page, url: string): Promise<DealDataType[] | undefined> {
        let items = undefined;
        try {
            await page.goto(url);
            items = await this.parseItemsList(page)
        } catch (e) {
            console.log(`getPageItems err... retrying...\n\n${e}`)
            await this.retry(async () => {
                await page.goto(url)
                items = await this.parseItemsList(page)
            }, 2000);
        }
        return items;
    }

    /* 
    @desc: Retry only one more time after milisec.
    @param: callback:Function
    @param: milisec:number
    @return: Promise<Array<Item>>
    */
    retry(callback: () => Promise<any>, milisec: number) {
        return new Promise((resolve, reject) => {
            // let interval = setInterval(async () => {
            //     let res = await callback();
            //     console.log("retrying...")
            //     if (res) {
            //         clearInterval(interval)
            //         resolve(res)
            //     }
            // }, milisec)

            // setTimeout(() => {
            //     clearInterval(interval);
            //     reject()
            // }, 10000)

            setTimeout(async () => {
                try {
                    let res = await callback();
                    resolve(res)
                } catch {
                    console.error("***Parse BB Item ERR***")
                    reject()
                }
            }, milisec)
        })
    }
}
