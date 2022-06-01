import { saveStoreItemToDatabase } from '#query/utilities.js';
import Bestbuy from '#bin/helper/BB.js'
import Microsoft from '#bin/helper/MS.js';
import Walmart from '#bin/helper/WM.js';

/* 
@desc: Get and save ms item price to db
*/
export const getMicrosoftLaptops = async () => {

    const STORE_NAME = "Microsoft";
    let store = new Microsoft();


    let skipItemsNum = 0
    let browser = await store.initBrowser();
    let page = await store.initPage(browser);
    let storeUrl = store.initURL(skipItemsNum)
    let { pagesNum, numPerPage } = await store.getPagesNum(page, storeUrl)    //puppeteer script get web footer contains page numbers.

    //for each page, get items and save to database
    try {
        for (let i = 0; i < pagesNum; i++) {
            let pageUrl = store.initURL(skipItemsNum)
            skipItemsNum += numPerPage;

            let items = await store.getPageItems(page, pageUrl)
            await Promise.all(items.map((item, index) =>
                saveStoreItemToDatabase(item, store.model).then(msg => {
                    let msgMap = new Map([
                        ["store", STORE_NAME],
                        ["page", i],
                        ["index", index],
                        ["sku", item.sku],
                        ["currentPrice", item.currentPrice],
                        ["msg", msg]
                    ])
                    store.printMsg(msgMap)

                })
                    .catch(e => console.error(`ERROR: page ${i} # ${index}: ${item.sku} ${item.name}\n`, e))
            )).finally(() => {
                console.log(`[${STORE_NAME}]===Page ${i} finished.===`)
            })
        }
    } catch (e) {
        console.error(`\nERROR:[${STORE_NAME}]Ended with exception\n${e}`)
        throw e
    }

    await page.close()
    await browser.close()

}

/* 
@desc: Get and save bb item price to db
*/
export const getBestbuyLaptops = async () => {
    const STORE_NAME = 'Bestbuy';
    let store = new Bestbuy();

    let cp = 1
    let browser = await store.initBrowser();
    let page = await store.initPage(browser);

    let storeUrl = store.initURL(cp)
    const { pagesNum } = await store.getPagesNum(page, storeUrl)    //puppeteer script get web footer contains page numbers.

    //for each page, get items and save to database
    try {
        for (let i = 0; i < pagesNum; i++) {
            let pageUrl = store.initURL(i + 1)

            //get items on page#-> for each item saveDatabase-> printResult-> finished
            let items = await store.getPageItems(page, pageUrl)
            await Promise.all(items.map((item, index) =>
                saveStoreItemToDatabase(item, store.model).then(msg => {
                    let msgMap = new Map([
                        ["store", STORE_NAME],
                        ["page", i],
                        ["index", index],
                        ["sku", item.sku],
                        ["currentPrice", item.currentPrice],
                        ["msg", msg]
                    ])
                    store.printMsg(msgMap);
                })
            )).finally(() => {
                console.log(`[${STORE_NAME}]===Page ${i} finished.===`)
            })
        }
    } catch (e) {
        console.error(`\nERROR:[${STORE_NAME}] Ended with exception.\n`, e)
        throw e
    }

    await page.close()
    await browser.close()

}
/* 
@param:enum store<Bestbuy|Microsoft>
@param: url:string
@return: spec:ItemSpec
*/
export const getItemConfiguration = async (store, url) => {
    console.log(`[getItemConfig] starting...`)
    let browser = await store.initBrowser();
    let page = await store.initPage(browser);
    let spec = await store.getItemSpec(page, url)

    await page.close();
    await browser.close();
    console.log(`[getItemConfiguration]:\n${JSON.stringify(spec, null, 4)}\n Finished`)
    return spec
}

/* 
@desc: Get and save bb item price to db
*/
export const getWalmartLaptops = async () => {
    const STORE_NAME = "Walmart";
    let store = new Walmart();

    let browser = await store.initBrowser();
    let page = await store.initPage(browser);

    const { pagesNum } = await store.getPagesNum(page, storeUrl)    //puppeteer script get web footer contains page numbers.
    //for each page, get items and save to database
    for (let i = 0; i < pagesNum; i++) {
        let pageUrl = store.initURL(i + 1)

        //get items on page#-> for each item saveDatabase-> printResult-> finished
        await store.getPageItems(page, pageUrl)
            .then(items => {
                return Promise.all(items.map((item, index) =>
                    saveStoreItemToDatabase(item, store.model).then(msg => {
                        let msgMap = new Map([
                            ["store", STORE_NAME],
                            ["page", i],
                            ["index", index],
                            ["sku", item.sku],
                            ["currentPrice", item.currentPrice],
                            ["msg", msg]
                        ])
                        store.printMsg(msgMap);
                    })
                ))
            })
            .catch(e => {
                console.error(`\nERROR:[Bestbuy] page ${i}\n Ended with exception.`)
            })
            .finally(() => {
                console.log(`[Bestbuy]===Page ${i} finished.===`)
            })
    }

    await page.close()
    await browser.close()

}

