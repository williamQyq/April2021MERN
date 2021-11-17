const BBItem = require('./models/BBItem');
const {
    BBScrip,
    BBNumScript,
    BBSku,
    BBSkuItemScript
} = require('./script_packages/Scripts.js');
const {pyProcessBB} = require('./script_packages/scraper.js');

const test = () => {
    console.log("[Test] starting test.js");

    pyProcessBB();
    // testBBSkuItem().then(result => {
    //     console.log(`script process result :${result}`)
    // });

}

module.exports = {
    test: test
}

const testBBSkuItem = () => {
    let itemLinkInfo = {
        "link": 'https://www.bestbuy.com/site/searchpage.jsp?_dyncharset=UTF-8&browsedCategory=pcmcat138500050001&id=pcat17071&iht=n&ks=960&list=y&qp=condition_facet%3DCondition~New&sc=Global&st=categoryid%24pcmcat138500050001&type=page&usc=All%20Categories',
        "link_index": 3
    }

    const BBSkuItem = new BBSkuItemScript(BBItem);
    python = BBSkuItem.spawnScript(itemLinkInfo)
    BBSkuItem.listenOn(python)
    return new Promise((resolve, reject) => {
        BBSkuItem.listenClose(python, resolve);
    })
}
