const { spawn } = require('child_process');
const JSON5 = require('json5')
const Item = require('../models/Item');
const BBItem = require('../models/BBItem');
const { Product } = require('../models/PriceProduct');
const { link } = require('fs');

const py_process = (_id, link) => {
    let tracked_product, dataString;
    const product = new Product(_id, link);

    let json_str = JSON.stringify(product);
    console.log(`Start crawling product price: ${json_str}`)
    const python = spawn('python', ['./script_packages/priceTracker.py', json_str]);
    console.log(`Python script start piping...`)

    //listen for python printout string data
    python.stdout.on('data', (data) => {
        console.log('Pipe data from python script...');
        tracked_product = JSON.parse(data.toString());
        dataString = data.toString();
    });

    //listen for python program close
    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        // console.log(`child process successful return data:${dataString}`)
        if (tracked_product) {
            update_product_db(tracked_product);
        } else {
            console.log(`child process close. Fail to get return from priceTracker`);
        }
    });

}

const update_product_db = (product) => {
    console.log(`update${JSON.stringify(product)}`)
    //update price and name returned from python script, push price_timestamp into price_timestamps
    Item.findByIdAndUpdate(product.id, {
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
}


const py_clock_cycle = async () => {

    const items = await Item.find({}).then(items => {
        items.forEach((item => {
            py_process(item._id, item.link);
        }))
    });

}

class Script {
    constructor(model) {
        this.model = model;
        this.script_path = './script_packages/priceTracker.py';
        this.link = `https://www.bestbuy.com/site/laptop-computers/all-laptops/pcmcat138500050001.c?id=pcmcat138500050001&qp=parent_operatingsystem_facet%3DParent%20Operating%20System~Windows`
    }
    spawnScript(arg) {
        let arg_strfy = JSON.stringify(arg);
        console.log(`Start crawling ${this.constructor.name}...`)
        return spawn('python', [this.script_path, arg_strfy]);
    }

    spawnlinkScript(_id, link) {
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

    updateByIdDB(Model, product) {
        console.log(`update${JSON.stringify(product)}`)
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

        console.log(`Updating price timestamps, name of product in DB...: ${JSON.stringify(product)}`)
    }

}

class BBScript extends Script {
    constructor(model) {
        super(model);
        this.script_path = './script_packages/bbLaptopsNum.py';
    }

}

class BBSkuItemScript extends Script {
    constructor(model) {
        super(model);
        this.script_path = './script_packages/bbSkuItem.py';
        this.data=[]
    }
    listenOn(python) {
        python.stdout.on('data', (data) => {
            console.log(`Pipe data from script: ${this.constructor.name}...`);
            this.data.push(JSON5.parse(data.toString()));
        })
    }
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
    let BBNum = new BBScript(BBItem);
    let BBSkuItem = new BBSkuItemScript(BBItem);
    //spawn script to get items number
    const python = BBNum.spawnScript(BBNum.link);

    // listen for script, get total items number
    BBNum.listenOn(python);
    const getBBNumPromise = new Promise((resolve, reject) => {
        BBNum.listenClose(python, resolve);
        BBNum.listenErr(python, reject);
    });

    //1. get bb sku-items num then
    //2. Each laptops page contains 24 sku items, calculate and init array of links.
    //3. for each page, for each sku item, findskuAndUpdate.
    getBBNumPromise.then(() => {

        const link_info = BBSkuItem.getLinkInfo(BBNum.data);
        const sku_items_python = BBSkuItem.spawnScript(link_info);
        BBSkuItem.listenOn(sku_items_python);
        const getBBSkuItemsPromise = new Promise((resolve, reject) => {
            BBSkuItem.listenClose(sku_items_python, resolve);
            BBSkuItem.listenErr(python, reject);
        });
        getBBSkuItemsPromise.then(() => {
            const sku_items = BBSkuItem.data;
            
            // count = 0;
            sku_items.forEach((item) => {
                console.log(item)
                // console.log(`${count}--${item.sku}`)
                // BBSkuItem.findSkuAndUpdate(item);
                count++;
            })

        })
    }, () => {
        console.log("BB Script Failure.");
    })

}

module.exports = {
    py_process: py_process,
    py_clock_cycle: py_clock_cycle,
    py_bb_process: py_bb_process,
}