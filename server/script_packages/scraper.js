import Bestbuy from './BB.js'
import Microsoft from './MS.js';
import { saveStoreItemToDatabase } from '../query/utilities.js';

/* 
@desc: Get and save ms item price to db
*/
export const getMicrosoftLaptops = async () => {

    let MS = new Microsoft();
    let skipItemsNum = 0
    let browser = await MS.initBrowser();
    let page = await MS.initPage(browser);
    let storeUrl = MS.initURL(skipItemsNum)
    const { pagesNum, numPerPage } = await MS.getPagesNum(page, storeUrl)    //puppeteer script get web footer contains page numbers.

    //for each page, get items and save to database
    for (let i = 0; i < pagesNum; i++) {
        let pageUrl = MS.initURL(skipItemsNum)
        skipItemsNum += numPerPage;

        await MS.getPageItems(page, pageUrl)
            .then(async (items) => {
                await Promise.all(items.map(async (item, index) =>
                    saveStoreItemToDatabase(item, MS.model)
                        .then(msg => {
                            let msgMap = new Map([
                                ["store", "Microsoft"],
                                ["page", i],
                                ["index", index],
                                ["sku", item.sku],
                                ["currentPrice", item.currentPrice],
                                ["msg", msg]
                            ])
                            MS.printMsg(msgMap)

                        })
                        .catch(e => console.error(`ERROR: page ${i} # ${index}: ${item.sku} ${item.name}\n`, e))
                ))
            })
            .catch(e => {
                console.error(`\nERROR:[Microsoft] page ${i}\n`)
            })
            .finally(() => {
                console.log(`[Microsoft]===Page ${i} finished.===`)
            })
    }

    await page.close()
    await browser.close()

}

/* 
@desc: Get and save bb item price to db
*/
export const getBestbuyLaptops = async () => {

    let BB = new Bestbuy();
    let cp = 1
    let browser = await BB.initBrowser();
    let page = await BB.initPage(browser);

    let storeUrl = BB.initURL(cp)
    const { pagesNum } = await BB.getPagesNum(page, storeUrl)    //puppeteer script get web footer contains page numbers.

    //for each page, get items and save to database
    for (let i = 0; i < pagesNum; i++) {
        let pageUrl = BB.initURL(i + 1)

        //get items on page#-> for each item saveDatabase-> printResult-> finished
        await BB.getPageItems(page, pageUrl)
            .then(items => Promise.all(items.map(async (item, index) => {
                if (item)
                    return saveStoreItemToDatabase(item, BB.model).then(msg => {
                        return new Map([
                            ["store", "Bestbuy"],
                            ["page", i],
                            ["index", index],
                            ["sku", item.sku],
                            ["currentPrice", item.currentPrice],
                            ["msg", msg]
                        ])
                    })
            })))
            .then(results => {
                results.forEach(result => {
                    BB.printMsg(result)
                })
            })
            .catch(() => {
                console.error(`\nERROR:[Bestbuy] page ${i}\n`)
            })
            .finally(() => {
                console.log(`[Bestbuy]===Page ${i} finished.===`)
            })
    }

    await page.close()
    await browser.close()

}
/* 
@param:enum store<Bestbuy|Microsoft>
@param: url:string
@return: ItemSpec<spec:{
        [key:string]:string
        ...
    }>
*/
export const getItemConfiguration = async (store, url) => {
    console.log(`[getItemConfig] starting...`)
    let browser = await store.initBrowser();
    let page = await store.initPage(browser);
    let spec = await store.getItemSpec(page, url)

    await page.close();
    await browser.close();
    console.log(`[getItemConfiguration]:\n${JSON.stringify(spec, null, 4)}`)
    return spec
}

