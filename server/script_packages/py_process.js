
const WL_Item = require('../models/WatchListItem');
const BBItem = require('../models/BBItem');
const CCItem = require('../models/CCItem');
const {
    BBScript,
    BBNumScript,
    BBSkuItemScript,
    CCNumScript,
    CCSkuItemScript } = require('./scripts.js');


const pyProcess = (_id, link) => {
    //Script Object crawl product price from a link
    let BBProdPrice = new BBScript(WL_Item);

    bbLaptopPricePromise(BBProdPrice, _id, link).then(() => {
        BBProdPrice.updateDBPriceById(WL_Item, BBProdPrice.data);
    })

}
const bbLaptopPricePromise = (BBProdPrice, _id, link) => {
    //spawn script process to get product price
    const python = BBProdPrice.spawnPriceScript(_id, link);

    //listen stdout of script, get product price info
    BBProdPrice.listenOn(python);
    const getLaptopPricePromise = new Promise((resolve, reject) => {
        BBProdPrice.listenClose(python, resolve);
        BBProdPrice.listenErr(python, reject);
    });
    return getLaptopPricePromise;
}

//set time clock iterate watch list, ***need to be revised latter***
// const pyClockCycle = async () => {

//     const items = await Item.find({}).then(items => {
//         items.forEach((item => {
//             py_process(item._id, item.link);
//         }))
//     });

// }

// load bb Condition New all products lists
const pyProcessBB = () => {
    let BBNum = new BBNumScript(BBItem);
    let BBSkuItems = new BBSkuItemScript(BBItem);
    //1. get bb sku-items num then
    //2. Each laptops page contains 24 sku items, calculate and init array of links.
    //3. for each page, for each sku item, findskuAndUpdate.
    bbAllLaptopsNewNumPromise(BBNum).then(() => {
        console.log(`BB all laptops new condtion: ${BBNum.data}`);
        bbAllLaptopsSkuItemsPromise(BBSkuItems, BBNum.data).then(() => {
        }, () => {
            console.log("BBSkuItem Script Failure");
        })
    }, () => {
        console.log("BBNum Script Failure.");
    })

}
// get all laptops new condition number promise, resolve when retrieve items number.
const bbAllLaptopsNewNumPromise = (BBNum) => {

    //spawn script to get items number
    const python = BBNum.spawnScript(BBNum.link);
    console.log(`link===${BBNum.link}`)

    // listen for script, get total items number
    BBNum.listenOn(python);
    const getAllLaptopsNumPromise = new Promise((resolve, reject) => {
        BBNum.listenClose(python, resolve);
        BBNum.listenErr(python, reject);
    });
    return getAllLaptopsNumPromise;
}

// get all laptops sku-items promise, resolve when retrieve all skus, names, currentPrices.
const bbAllLaptopsSkuItemsPromise = (BBSkuItems, num_of_pages) => {
    const link_info = BBSkuItems.getLinkInfo(num_of_pages);
    const sku_items_python = BBSkuItems.spawnScript(link_info);
    BBSkuItems.listenOn(sku_items_python);
    const getBBSkuItemsPromise = new Promise((resolve, reject) => {
        BBSkuItems.listenClose(sku_items_python, resolve);
        BBSkuItems.listenErr(sku_items_python, reject);
    });
    return getBBSkuItemsPromise;
}

const pyProcessCC = () => {
    let CCNum = new CCNumScript(CCItem);
    let CCSkuItems = new CCSkuItemScript(CCItem);
    //1. get bb sku-items num then
    //2. Each laptops page contains 24 sku items, calculate and init array of links.
    //3. for each page, for each sku item, findskuAndUpdate.
    ccAllLaptopsNewNumPromise(CCNum).then(() => {
        // ccAllLaptopsSkuItemsPromise(CCSkuItems, CCNum.data).then(() => {
        // }, () => {
        //     console.log("CCSkuItem Script Failure");
        // })
    }, () => {
        console.log("CCNum Script Failure.");
    })
}
// get all laptops new condition number promise, resolve when retrieve items number.
const ccAllLaptopsNewNumPromise = (CCNum) => {

    //spawn script to get items number
    const python = CCNum.spawnScript(CCNum.link);

    // listen for script, get total items number
    CCNum.listenOn(python);
    const getAllLaptopsNumPromise = new Promise((resolve, reject) => {
        CCNum.listenClose(python, resolve);
        CCNum.listenErr(python, reject);
    });
    return getAllLaptopsNumPromise;
}

// get all laptops sku-items promise, resolve when retrieve all skus, names, currentPrices.
const ccAllLaptopsSkuItemsPromise = (CCSkuItems, num_of_pages) => {
    const link_info = CCSkuItems.getLinkInfo(num_of_pages);
    const sku_items_python = CCSkuItems.spawnScript(link_info);
    CCSkuItems.listenOn(sku_items_python);
    const getCCSkuItemsPromise = new Promise((resolve, reject) => {
        CCSkuItems.listenClose(sku_items_python, resolve);
        CCSkuItems.listenErr(sku_items_python, reject);
    });
    return getCCSkuItemsPromise;
}

const test = () => {
    let item_data = {
        name:"test",
        link:"test",
        sku:1,
        currentPrice:2
    }

    const BBSkuScript = new BBSkuItemScript(BBItem); 
    BBSkuScript.findSkuAndUpdate(item_data);

}

module.exports = {
    pyProcess: pyProcess,
    pyProcessBB: pyProcessBB,
    pyProcessCC: pyProcessCC,
    test: test,
}