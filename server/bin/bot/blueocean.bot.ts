import { DealBot } from "./index";
import puppeteer from "puppeteer";
export default class BlueOcean extends DealBot {
    supplierUrl: string = "https://www.walmart.com/browse/electronics/computers-laptops-and-tablets/3944_1089430";
    constructor() {
        super();
    }
    async getDeal() {
        try {
            const browser = await this.initBrowser();
            const page = await this.initPage(browser);

            await page.goto(this.supplierUrl);
            console.log(`blueocean get deal.`)

        } catch (err) {

        }
    }


    startScheduler(): void {
    }
    editParamPageNumInUrl(pageIndex: number): void {
    }
    async getPagination(page: puppeteer.Page, url: string): Promise<void> {
        return;
    }


}