const BBItem = require('./models/BBItem');
const {
    BBScript,
    BBSkuItemScript,
    MsScript,
    MsSkuItemScript

} = require('./script_packages/Scripts.js');
const { bestbuyScraper, microsoftScraper } = require('./script_packages/scraper.js');
const MsItem = require('./models/MsItem');

const test = () => {
    console.log("[Test] starting test.js");

    // microsoftScraper();
    // testBBSkuItem()
    testMsSkuItem()
        .then(result => {
            console.log(result)
        }).catch(err => {
            console.error(err);
        })
}

// const testBBSkuItem = () => {
//     let itemLinkInfo = {
//         "link": 'https://www.bestbuy.com/site/searchpage.jsp?_dyncharset=UTF-8&browsedCategory=pcmcat138500050001&id=pcat17071&iht=n&ks=960&list=y&qp=condition_facet%3DCondition~New&sc=Global&st=categoryid%24pcmcat138500050001&type=page&usc=All%20Categories',
//         "link_index": 3
//     }

//     const BBSkuItem = new BBSkuItemScript(BBItem);
//     python = BBSkuItem.spawnScript(itemLinkInfo)
//     BBSkuItem.listenOn(python)
//     return new Promise((resolve, reject) => {
//         BBSkuItem.listenClose(python, resolve);
//     })
// }
const testMsSkuItem = () => {
    let itemLinkInfo = {
        "link": 'https://www.microsoft.com/en-us/store/b/shop-all-pcs?categories=2+in+1||Laptops||Desktops||PC+Gaming&s=store&skipitems=',
        "link_index": 2
    }

    let MsSkuItem = new MsSkuItemScript(MsItem);
    const python = MsSkuItem.spawnScript(MsSkuItem.skuItemScriptPath, itemLinkInfo)
    MsSkuItem.listenOn(python);
    return new Promise((resolve, reject) => {
        MsSkuItem.listenClose(python, resolve);
        MsSkuItem.listenErr(python, reject);
    })
}

module.exports = {
    test: test
}