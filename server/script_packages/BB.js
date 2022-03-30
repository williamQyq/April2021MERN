import BBItem from '../models/BBItem.js';
import Stores from './Stores.js';
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
    [key:string]:value:string
    ...
}
*/

/* 
interface PageNumFooter{
    numPerPage: number,
    totalNum: number
}

*/

export default class Bestbuy extends Stores {
    model = BBItem
    constructor() {
        super();
        this.url = 'https://www.bestbuy.com/site/searchpage.jsp?_dyncharset=UTF-8&browsedCategory=pcmcat138500050001&cp=1&id=pcat17071&iht=n&ks=960&list=y&qp=condition_facet%3DCondition~New&sc=Global&st=categoryid%24pcmcat138500050001&type=page&usc=All%20Categories'
    }
    initURL(cp) {
        return this.url.replace(/(&cp=)(\d+)/, "$1" + cp)
    }

    /* 
    @param: page:Puppeteer<page>
    @param: url:string
    @return: itemSpec:ItemSpec
    */
    async getItemSpec(page, url) {
        await page.goto(url);
        await this.#openSpecWrapper(page);
        let itemSpec = await this.#parseItemSpec(page);
        return itemSpec;
    }
    async #openSpecWrapper(page) {
        let specWrapper = (await page.$x('//div[@class="specs-container specs-wrapper all-specs-wrapper"]'))[0]
        specWrapper.click()
    }
    async #parseItemSpec(page) {
        const KEYS_XPATH_EXPR = '//div[@class="row-title"]'
        const VALUES_XPATH_EXPR = '//div[contains(@class,"row-value")]'
        let keys = await this.evaluateElementsText(page, KEYS_XPATH_EXPR)
        let values = await this.evaluateElementsText(page, VALUES_XPATH_EXPR)

        let spec = {}
        keys.forEach((key, index) => {
            // key= key.split(' ').join('')
            key = key.replace(/\s/g, "")    //remove space
            spec[key] = values[index]
        })

        return spec
    }
    /* 
    @param: page:Puppeteer<page>
    @return: PageNumFooter
    */
    async #parsePageNumFooter(page) {
        let pageNumFooter = {
            numPerPage: undefined,
            totalNum: undefined
        };
        const FOOTER_XPATH_EXPR = '//div[@class="footer top-border wrapper"]//span'
        const NUM_PAGE_REGEX_EXPR = /\d*-(\d*)\sof\s\d*/
        const TOTAL_NUM_REGEX_EXPR = /.*of\s(\d*)\sitems/

        let footer = (await this.evaluateElementsText(page, FOOTER_XPATH_EXPR))[0]
        pageNumFooter.numPerPage = Number(this.getRegexValue(footer, NUM_PAGE_REGEX_EXPR))
        pageNumFooter.totalNum = Number(this.getRegexValue(footer, TOTAL_NUM_REGEX_EXPR))

        console.log(`[${this.constructor.name}][Parse Page Num Footer] numPerPage:${pageNumFooter.numPerPage}, totalNum:${pageNumFooter.totalNum}`)

        return pageNumFooter
    }

    async closeDialog(page) {

    }

    /* 
    @param: page:Puppeteer<page>
    @param: url: string
    @return: PageNumFooter
    */
    async getPagesNum(page, url) {
        await page.goto(url);
        let { totalNum, numPerPage } = await this.#parsePageNumFooter(page)
        let pageNumFooter = {
            pagesNum: Math.ceil(totalNum / numPerPage),
            numPerPage: numPerPage
        }

        return pageNumFooter
    }
    /* 
        @param: page:Puppeteer<page>
        @return: itemsArray:Array<Item>
        @access: private
    */
    async #parseItemsList(page) {
        const SKU_LIST_EXPR = '//li[@class="sku-item"]'
        const PRICE_LIST_EXPR = SKU_LIST_EXPR + '//div[@class="priceView-hero-price priceView-customer-price"]/span[@aria-hidden="true"]'
        const NAME_LIST_EXPR = SKU_LIST_EXPR + '//h4[@class="sku-header"]/a'
        const SKU_ATTRIBUTE_ID = "data-sku-id"

        const siteLink = 'https://www.bestbuy.com/site/***sku***.p?skuId=***sku***'

        let skuAttrLists = await this.evaluateItemAttribute(page, SKU_LIST_EXPR, SKU_ATTRIBUTE_ID)
        let priceTextLists = await this.evaluateElementsText(page, PRICE_LIST_EXPR)
        let nameLists = await this.evaluateElementsText(page, NAME_LIST_EXPR)

        //Parsed Array<Item>
        let itemsArray = skuAttrLists.map((sku, index) => {
            let link = siteLink.replace(/\*\*\*sku\*\*\*/g, sku)
            let name = nameLists[index]
            let currentPrice = Number(priceTextLists[index].replace(/[\s|$|,]/g, ""))
            let item = {
                link,
                sku,
                currentPrice,
                name
            }
            return item;
        })
        
        return itemsArray;
    }

    /* 
    @param: page: Puppeteer<page>
    @param: url: string
    @return: items: Array<Item>
    */
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

    /* 
    @desc: Retry only one more time after milisec.
    @param: callback:Function
    @param: milisec:number
    @return: Promise<Array<Item>>
    */
    retry(callback, milisec) {
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
