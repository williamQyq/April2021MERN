const BBItem = require('../models/BBItem');
const MSItem = require('../models/MsItem');
const { Bestbuy, Microsoft } = require('./Stores');

//get pages info, then for each page save new and price changed laptop to db 
// const getBestbuyLaptops = () => {
//     let store = new Bestbuy(BBItem);
//     return new Promise((resolve, reject) => {
//         getNumOfAllNewLaptops(store, (pagesInfo) => {
//             getAllNewLaptops(store, pagesInfo, async (item) => {
//                 await store.insertAndUpdatePriceChangedItem(item)
//             })
//                 .then(result => resolve(result))
//                 .catch(e => reject(e))
//         })
//             .catch(e => reject(e))
//     })

// }

// //Load microsoft all new products lists Promise
// //Get microsoft page numbers; then for each page and sku item, findSkuAndUpdate
// const getMicrosoftLaptops = () => {
//     let store = new Microsoft(MsItem);
//     return new Promise((resolve, reject) => {
//         getNumOfAllNewLaptops(store, (pagesInfo) => {
//             getAllNewLaptops(store, pagesInfo, async (item) => {
//                 await store.insertAndUpdatePriceChangedItem(item)
//             })
//                 .then(result => resolve(result))
//                 .catch(e => reject(e))
//         })
//             .catch(e => reject(e))
//     })

// }

// // get all laptops new condition number promise, resolve when retrieve items number.
// const getNumOfAllNewLaptops = (store, callback) => (
//     store.exec(store.pageNumScriptPath, store.link, (data) => {
//         const { total_num, num_per_page } = data;
//         console.log(`[BB num of all laptops new condtion]: ${total_num} - ${num_per_page}/per page.`);
//         let pagesInfo = store.getLinkInfo(total_num, num_per_page)
//         callback(pagesInfo)
//     })

// )

// // get all laptops sku-items promise, resolve when retrieve all skus, names, currentPrices.
// const getAllNewLaptops = (store, pagesInfo, callback) => (
//     store.exec(store.skuItemScriptPath, pagesInfo, (data) => {
//         callback(data)
//     })
// )
const getMicrosoftLaptops = async () => {

    let MS = new Microsoft();
    let msUrl = MS.url
    let url = msUrl.base + msUrl.skipItemsNum
    let browser = await MS.initBrowser();
    let page = await MS.initPage(browser);
    const { pagesNum, numPerPage } = await MS.getPagesNum(page, url)

    return new Promise(async (resolve, reject) => {
        try {
            msUrl.skipItemsNum = 0

            //for each page, get items and save to database
            for (let i = 0; i < pagesNum; i++) {
                msUrl.skipItemsNum += (numPerPage * i);
                let url = msUrl.base + msUrl.skipItemsNum;
                await MS.getItems(page, url).then(items =>
                    items.forEach((item, index) => {
                        console.log(`[Microsoft]page ${i} # ${index}:${item.sku} get item finished.`)
                        // saveItemToDatabase(item, MSItem)
                    }))
            }
            resolve(`[Microsoft] Finished.`)
        } catch (e) {
            reject(e)
        }
    })

}


const getItemConfiguration = async (store, url) => {
    console.log(`[getItemConfig] starting...`)
    let browser = await store.initBrowser();
    let page = await store.initPage(browser);
    let spec = await store.getItemSpec(page, url)

    await page.close();
    await browser.close();
    console.log(`[getItemConfiguration]:\n${JSON.stringify(spec, null, 4)}`)
    return spec
}

module.exports = {
    getMicrosoftLaptops,
    // getBestbuyLaptops,
    getItemConfiguration

}