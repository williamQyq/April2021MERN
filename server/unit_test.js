/*
    this file for functionality testing purpose

*/
// const { Bestbuy } = require('./script_packages/Scripts')
const { Bestbuy } = require('./script_packages/Stores.js');
const test = async () => {
    // console.log("[Test] starting test.js");
    // let store = new Bestbuy()
    let bb = new Bestbuy()
    let browser = await bb.initBrowser();
    let page = await bb.initPage(browser);
    const url = "https://www.bestbuy.com/site/asus-2-in-1-15-6-touch-screen-chromebook-intel-core-11th-gen-i3-8gb-memory-128gb-ssd-matte-white-matte-white/6449514.p?skuId=6449514"
    let spec = await bb.getItemSpec(page, url)
    console.log(JSON.stringify(spec, null, 4))
    
    console.log(spec.UPC)
    await page.close();
    await browser.close();
    // await store.initBrowser();
    // await store.initPage();
    // await store.getItems();


}
test();
