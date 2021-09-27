const { spawn } = require('child_process');
const JSON5 = require('json5')
const WL_Item = require('../models/WatchListItem');
const BBItem = require('../models/BBItem');
const { Product } = require('../models/PriceProduct');

const py_process = (_id, link) => {
    //Script Object crawl product price from a link
    let BBProdPrice = new BBScript(WL_Item);

    bbLaptopPricePromise(BBProdPrice,_id,link).then(()=>{
        BBProdPrice.updateDBPriceById(WL_Item,BBProdPrice.data);
    })

}
const bbLaptopPricePromise = (BBProdPrice,_id, link) => {
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

const py_clock_cycle = async () => {

    const items = await Item.find({}).then(items => {
        items.forEach((item => {
            py_process(item._id, item.link);
        }))
    });

}
// parent BB script 
class BBScript {
    constructor(model) {
        this.model = model;
        this.script_path = './script_packages/priceTracker.py';
        this.link = `https://www.bestbuy.com/site/searchpage.jsp?_dyncharset=UTF-8&browsedCategory=pcmcat138500050001&id=pcat17071&iht=n&ks=960&list=y&qp=condition_facet%3DCondition~New%5Eparent_operatingsystem_facet%3DParent%20Operating%20System~Windows&sc=Global&st=categoryid%24pcmcat138500050001&type=page&usc=All%20Categories`
    }
    spawnScript(arg) {
        let arg_strfy = JSON.stringify(arg);
        console.log(`Start crawling ${this.constructor.name}...`)
        return spawn('python', [this.script_path, arg_strfy]);
    }

    spawnPriceScript(_id, link) {
        const product = new Product(_id, link);
        const product_arg = JSON.stringify(product);
        console.log(`Start crawling product price...: ${product_arg}`)
        return spawn('python', [this.script_path, product_arg]);
    }

    listenOn(python) {
        python.stdout.on('data', (data) => {
            console.log(`Pipe data from script: ${this.constructor.name}...`);
            this.data = JSON5.parse(data.toString());
        })
    }
    listenClose(python, resolve) {
        python.on('close', (code) => {
            console.log(`${this.constructor.name} child process close all stdio with code ${code}`);
            resolve();
        })
    }
    listenErr(python, reject) {
        python.on('error', () => {
            console.log(`${this.constructor.name} child process close with ERROR`);
            reject();
        })
    }

    updateDBPriceById(Model, product) {
        //update price and name returned from python script, push price_timestamp into price_timestamps
        Model.findByIdAndUpdate(product.id, {
            name: product.name,
            $push: {
                price_timestamps: {
                    price: product.currentPrice,
                }
            }
        }, { useFindAndModify: false }, (err, docs) => {
            if (err) {
                console.log(`[Error]Update name and price by _id: ${product.id} Failure`)
            } else {
                console.log(`Updated _id: ${product.id} Success`)
            }
        });

        console.log(`Updated price timestamps, name of product in DB...:\n${JSON5.stringify(product)}`)
    }

}

class BBNumScript extends BBScript {
    constructor(model) {
        super(model);
        this.script_path = './script_packages/bbLaptopsNum.py';
    }

}

class BBSkuItemScript extends BBScript {
    constructor(model) {
        super(model);
        this.script_path = './script_packages/bbSkuItem.py';
        this.data = []
    }
    listenOn(python) {
        python.stdout.pipe(require('JSONStream').parse()).on('data',(data)=>{
            // console.log(`Pipe data from script: ${this.constructor.name}...`);
            console.log(`Pipe data into DB on SKU:${data.sku}\n ${JSON5.stringify(data)}`)
            this.findSkuAndUpdate(data)
        })
    }
    // listenOn(python) {
    //     python.stdout.on('data', (data) => {
    //         
    //         console.log(JSON5.parse(data.toString()));
    //     })
    // }
    getLinkInfo(item_num) {
        return ({
            link: this.link,
            link_index: Math.ceil(item_num / 24)
        })
    }

    findSkuAndUpdate(item) {
        let query = { sku: item.sku },
            update = {
                name: item.name,
                link: item.link,
                price_timestamps: [{
                    price: item.currentPrice
                }]
            },
            options = { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false }

        this.model.findOneAndUpdate(query, update, options, (err, doc) => {
            if (err) return;

            // console.log(`sku-item doc update:${doc}`);
        })
    }

}

// load bb Condition New all products lists
const py_bb_process = () => {
    let BBNum = new BBNumScript(BBItem);
    let BBSkuItems = new BBSkuItemScript(BBItem);
    //1. get bb sku-items num then
    //2. Each laptops page contains 24 sku items, calculate and init array of links.
    //3. for each page, for each sku item, findskuAndUpdate.
    bbAllLaptopsNewNumPromise(BBNum).then(() => {
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
module.exports = {
    py_process: py_process,
    py_clock_cycle: py_clock_cycle,
    py_bb_process: py_bb_process,
}