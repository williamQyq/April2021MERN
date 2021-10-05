const { spawn } = require('child_process');
const { Product } = require('../models/PriceProduct');
const JSON5 = require('json5');
const JSONStream = require('JSONStream');

// parent script 
class Script {
    constructor(model) {
        this.model = model;

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
            console.log(`\n${this.constructor.name} child process close all stdio with code ${code}`);
            resolve();
        })
    }
    listenErr(python, reject) {
        python.on('error', () => {
            console.log(`\n${this.constructor.name} child process close with ERROR`);
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
class BBScript extends Script {
    constructor(model) {
        super(model);
        this.script_path = './script_packages/priceTracker.py';
        this.link = `https://www.bestbuy.com/site/searchpage.jsp?_dyncharset=UTF-8&browsedCategory=pcmcat138500050001&id=pcat17071&iht=n&ks=960&list=y&qp=condition_facet%3DCondition~New%5Eparent_operatingsystem_facet%3DParent%20Operating%20System~Windows&sc=Global&st=categoryid%24pcmcat138500050001&type=page&usc=All%20Categories`;
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
    }
    listenOn(python) {
        python.stdout.pipe(require('JSONStream').parse()).on('data', (data) => {
            // console.log(`Pipe data from script: ${this.constructor.name}...`);
            this.findSkuAndUpdate(data)
        })
    }
    getLinkInfo(item_num) {
        return ({
            link: this.link,
            link_index: Math.ceil(item_num / 24)
        })
    }

    findSkuAndUpdate(item_data) {
        //aggregate find item that matched on sku in DB, then update price changed item.
        this.findPriceChangedItem(item_data).then(price_change_items => {
            if (price_change_items.length != 0) {    //sku item in DB exists and price changed
                let pChangeItem = price_change_items.pop();
                let update = {
                    $push: {
                        price_timestamps: {
                            price: item_data.currentPrice
                        }
                    }
                },
                    options = { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false }

                this.model.findByIdAndUpdate(pChangeItem._id, update, options).then(pChangeItem => {
                    console.log(`Update price changed item in DB on SKU:${pChangeItem.sku}\n${JSON5.stringify(pChangeItem)}`)
                });
            } else {
                this.setOnInsert(item_data);
            }
        })

    }
    findPriceChangedItem(item) {
        return this.model.aggregate([
            {
                $project: {
                    link: 1,
                    name: 1,
                    sku: 1,
                    PreviousPrice: {
                        $arrayElemAt: [
                            "$price_timestamps.price", -1
                        ]
                    },
                    IsCurrentPriceChanged: {
                        $ne: [
                            item.currentPrice,
                            {
                                $arrayElemAt: [
                                    "$price_timestamps.price",
                                    -1 // depends on prices stored by pushing to the end of history array.
                                ]
                            }
                        ]
                    }
                }
            },
            {
                $match: {
                    sku: item.sku,
                    IsCurrentPriceChanged: true
                }
            }
        ])
    }
    setOnInsert = (item) => {
        let SET_ON_INSERT_QUERY = { sku: item.sku },
            update = {
                $setOnInsert: {
                    sku: item.sku,
                    name: item.name,
                    link: item.link,
                    price_timestamps: [{
                        price: item.currentPrice
                    }]
                }
            },
            options = { upsert: true }
        this.model.updateOne(SET_ON_INSERT_QUERY, update, options).then((result) => {
            // console.log(`result:${JSON.stringify(result)}`)
            if (result.upserted) {
                console.log(`Insert new item into DB on SKU: ${item.sku}`)
            } else {
                console.log(`Item exists, Price no Changed: ${item.sku}`);
            }
        });

    }

}

class CCNumScript extends Script {
    constructor(model) {
        super(model);
        this.script_path = './script_packages/ccLaptopsNum.py';
        this.link = 'https://www.costco.com/laptops.html';
    }
}
class CCSkuItemScript extends Script {
    constructor(model) {
        super(model);
        this.script_path = './script_packages/ccSkuItem.py';
    }
    listenOn(python) {
        python.stdout.pipe(JSONStream.parse()).on('data', (data) => {
            // console.log(`Pipe data from script: ${this.constructor.name}...`);
            console.log(`Pipe data into DB on SKU:${data.sku}\n ${JSON5.stringify(data)}`)
            this.findSkuAndUpdate(data)
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

module.exports = {
    BBScript: BBScript,
    BBNumScript: BBNumScript,
    BBSkuItemScript: BBSkuItemScript,
    CCNumScript: CCNumScript,
    CCSkuItemScript: CCSkuItemScript
}