import { DealDataType, DealItemSpec, DealsAlert } from '#query/deals.query';
import { DealBot, MyMessage, Pagination } from './index';
import puppeteer, { Page } from 'puppeteer';
import io from 'index';
import Scheduler from '#root/bin/helper/Scheduler';

export default class Bestbuy extends DealBot {
    storeName: string = "Bestbuy";
    static url: string = 'https://www.bestbuy.com/site/searchpage.jsp?_dyncharset=UTF-8&browsedCategory=pcmcat138500050001&cp=1&id=pcat17071&iht=n&ks=960&list=y&qp=condition_facet%3DCondition~New&sc=Global&st=categoryid%24pcmcat138500050001&type=page&usc=All%20Categories';
    constructor() {
        super();
    }

    async getAndSaveLaptopsPrice() {
        const logger = new MyMessage();
        const alert = new DealsAlert({ logger, storeName: this.storeName });
        const model = DealsAlert._BestbuyDeal;
        let storeUrl = this.editParamPageNumInUrl(1);
        let browser: puppeteer.Browser | undefined;
        let page: puppeteer.Page | undefined;

        let testMode = false;    //For Testing*

        try {
            browser = await this.initBrowser();
            page = await this.initPage(browser);

            const { pageCnt }: Pagination = await this.getPagination(page, storeUrl);
            if (!pageCnt) throw new Error("*Parse Pagination fail*")
            // For each page, get deals, save to database and print process status. 

            let dealPageCnt = testMode ? 1 : pageCnt;

            for (let i = 0; i < dealPageCnt; i++) {
                let pageUrl = this.editParamPageNumInUrl(i + 1);
                let dealsData: DealDataType[] | undefined = await this.getPageItems(page, pageUrl, { retryIfErr: true });

                if (!dealsData) throw new Error("Fail to retrieve deals data.");

                await alert.createMultiDeals(
                    dealsData as Required<DealDataType>[],
                    model
                )
                    .finally(() => {
                        logger.printPageEndLine({ storeName: this.storeName, index: i });
                    });
            }
        } catch (e) {
            logger.printError(e);
            io.sockets.emit("RETRIEVE_BB_ITEMS_ONLINE_PRICE_ERROR", { msg: `Fail to retrive Bestbuy Laptop Price \n\n${e}` })
        }

        if (page) await page.close();
        if (browser) await browser.close();

        //notify browser
        io.sockets.emit("ON_RETRIEVED_BB_ITEMS_ONLINE_PRICE", { msg: "All deals retieved success" });
    }

    async fetchAndSaveItemSpecification(url: string, sku: string) {
        let deals = new DealsAlert({ storeName: this.storeName });

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
            if (key != null) {
                key = key.replace(/\s/g, "");
                spec.set(key, values[index]);
            }
        })

        return spec
    }

    /* 
    @param: page:Puppeteer<page>
    @return: PageNumFooter
    */
    async parsePageNumFooter(page: Page): Promise<Pagination> {
        const logger = new MyMessage();
        let pagination: Required<Pagination> | undefined;

        const FOOTER_XPATH_EXPR = '//div[@class="footer top-border wrapper"]//span'
        const NUM_PAGE_REGEX_EXPR: RegExp = /\d*-(\d*)\sof\s\d*/;
        const TOTAL_NUM_REGEX_EXPR: RegExp = /.*of\s(\d*)\sitems/;

        let footer = (await this.evaluateElementsText(page, FOOTER_XPATH_EXPR))[0]
        if (!footer) throw new Error("footer element is evaluated as undefined.");

        let itemCntPerPage: number = Number(this.getRegexValue(footer, NUM_PAGE_REGEX_EXPR))
        let itemsCount: number = Number(this.getRegexValue(footer, TOTAL_NUM_REGEX_EXPR))

        pagination = {
            pageCnt: Math.ceil(itemsCount / itemCntPerPage),
            itemCntPerPage
        }

        logger.printPagination({ ...pagination, storeName: this.storeName });

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
        let priceTextLists = await this.evaluateScrollLoadingElementsText(page, PRICE_LIST_EXPR)
        let nameLists = await this.evaluateScrollLoadingElementsText(page, NAME_LIST_EXPR)

        const combinedArray = skuAttrLists.map((sku, index) => ({
            arraySku: sku,
            arrayPrice: priceTextLists[index],
            arrayName: nameLists[index]
        }))
        console.table(combinedArray);

        //Parsed Array<Item>
        let itemsArray = combinedArray.map(deal => {
            let link = this.generateSiteLink(deal.arraySku);
            if (deal.arrayPrice && deal.arrayName) {
                let currentPrice = this.validatePrice(deal.arrayPrice);
                let item: DealDataType = {
                    link,
                    sku: deal.arraySku,
                    currentPrice,
                    name: deal.arrayName
                };

                return item;

            } else {
                console.warn(`Parsed ${deal.arraySku} have undefined value.`);
                console.table({ link, name: deal.arrayName, priceInCurrency: deal.arrayPrice });
                return null;
            }
        }).filter(item => item !== null) as DealDataType[];

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
    async getPageItems(page: Page, url: string, options: { retryIfErr: boolean }): Promise<DealDataType[] | undefined> {
        let items = undefined;
        try {
            await page.goto(url);
            items = await this.parseItemsList(page);
        } catch (e) {
            console.error(`Get Page Items Err:\n${e}\n`);
            if (options.retryIfErr) {
                items = this.retry<DealDataType[] | undefined>(() =>
                    this.getPageItems(page, url, { retryIfErr: false })
                    , 2000);
            }
        }
        return items;
    }

    /* 
    @desc: Retry only one more time after milisec.
    @param: callback:Function
    @param: milisec:number
    @return: Promise<Array<Item>>
    */
    retry<T>(callback: () => Promise<T | undefined>, milisec: number): Promise<T | undefined> {
        console.log(`Retrying...\n\n`);
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
    startScheduler(): void {
        const sc = new Scheduler({
            schedule: '00 00 08 * * *',
            process: this.getAndSaveLaptopsPrice
        });

        sc.start();
    }
}
