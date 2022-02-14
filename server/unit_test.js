/*
    this file for functionality testing purpose

*/
// const { Bestbuy } = require('./script_packages/Scripts')
import { Bestbuy } from'./script_packages/Stores.js'
const test = async () => {
    // console.log("[Test] starting test.js");
    // let store = new Bestbuy()
    let bb = new Bestbuy()
    bb.test()
    // await store.initBrowser();
    // await store.initPage();
    // await store.getItems();


}
test();
module.exports = {
    test: test
}