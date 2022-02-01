/*
    this file for functionality testing purpose

*/
const { Bestbuy } = require('./script_packages/Scripts')
const BBItem = require('./models/BBItem')
const { bestbuy } = require('./script_packages/scraper.js');
const { ObjectFlags } = require('typescript');

const test = () => {
    console.log("[Test] starting test.js");
    bestbuy().then(res => { console.log(`bestbuy: `, res) });
    // const store = new Bestbuy(BBItem);
    // store.insertAndUpdatePriceChangedItem({
    //     link: "www.bb.com",
    //     sku: "111",
    //     currentPrice: 2,
    //     name: "test"
    // })
 
}

const prom = (callback) => {
    callback()
    return new Promise((resolve, reject) => {
        resolve("promise resolve")
    })

}

const testBBSkuItem = () => {
    let itemLinkInfo = {
        "link": 'https://www.bestbuy.com/site/searchpage.jsp?_dyncharset=UTF-8&browsedCategory=pcmcat138500050001&id=pcat17071&iht=n&ks=960&list=y&qp=condition_facet%3DCondition~New&sc=Global&st=categoryid%24pcmcat138500050001&type=page&usc=All%20Categories',
        "pages": 2
    }

    let BBSkuItem = new BBSkuItemScript(BBItem);
    const python = BBSkuItem.spawnScript(BBSkuItem.skuItemScriptPath, itemLinkInfo)
    BBSkuItem.listenOn(python)
    return new Promise((resolve, reject) => {
        BBSkuItem.listenClose(python, resolve);
        BBSkuItem.listenErr(python, reject);
    })
}

const testMsSkuItem = () => {
    let itemLinkInfo = {
        "link": 'https://www.microsoft.com/en-us/store/b/shop-all-pcs?categories=2+in+1||Laptops||Desktops||PC+Gaming&s=store&skipitems=',
        "pages": 9
    }

    let MsSkuItem = new MsSkuItemScript(MsItem);
    const python = MsSkuItem.spawnScript(MsSkuItem.skuItemScriptPath, itemLinkInfo)
    MsSkuItem.listenOn(python);
    return new Promise((resolve, reject) => {
        MsSkuItem.listenClose(python, resolve);
        MsSkuItem.listenErr(python, reject);
    })
}

const testMsNum = () => {
    let MsNum = new MsScript(MsItem);
    const python = MsNum.spawnScript(MsNum.pageNumScriptPath, MsNum.link)
    MsNum.listenOn(python);
    return new Promise((resolve, reject) => {
        MsNum.listenClose(python, resolve);
        MsNum.listenErr(python, reject);
    })
}

const updateSchema = () => {
    BBItem.find(
        { 'sku': { $type: 16 } }
    ).then(results => {
        results.forEach(doc => {
            console.log(doc.sku)
            // doc.remove().then(() => {
            //     console.log('removed')
            // })
            doc.sku = new String(doc.sku)
            doc.markModified('sku')
            doc.save().then(() => {
                console.log(`finished update: ${doc.sku}`)
            })
        })

    }, err => {
        console.error(err)
    })
}

module.exports = {
    test: test
}