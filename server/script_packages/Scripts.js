const { spawn } = require('child_process');
const { Product } = require('../models/PriceProduct.js');
const JSON5 = require('json5');
const JSONStream = require('JSONStream');

const { getCurPrice } = require('../query/aggregate.js');

// parent script 
class Script {
    constructor(model) {
        this.model = model;

    }
    spawnScript(arg) {
        let arg_strfy = JSON.stringify(arg);
        console.log(`[Script] Start running ${this.constructor.name}...`)
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
            // console.log(`\n${this.constructor.name} child process close all stdio with code ${code}`);
            resolve();
        })
    }
    listenErr(python, reject) {
        python.on('error', () => {
            console.log(`\n${this.constructor.name} ***child process close with ERROR***`);
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
        this.link = `https://www.bestbuy.com/site/searchpage.jsp?_dyncharset=UTF-8&browsedCategory=pcmcat138500050001&id=pcat17071&iht=n&ks=960&list=y&qp=condition_facet%3DCondition~New&sc=Global&st=categoryid%24pcmcat138500050001&type=page&usc=All%20Categories`;
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
            
            if(!isNaN(data.sku)){   //validate non package sku items
                data.sku = Number(data.sku);
                data.currentPrice = Number(data.currentPrice);    //tricky, convert data.currentPrice from string to number, instead of parseFloat toFixed.
                this.insertAndUpdateItem(data);
            } else {
                console.log(`Attention**, this item does not have sku. Skip: ${data.sku}`);
            }
        })
    }
    getLinkInfo(totalNum, numPerPage) {     //return link and calculate the # of pages need to loop.
        return ({
            link: this.link,
            link_index: Math.ceil(totalNum / numPerPage)
        })
    }
    insertAndUpdateItem(itemBB) {
        let isSkuInsert = this.setOnInsert(itemBB); //true if insert new item; false if item exists.

        if (!isSkuInsert) {
            this.findPriceChangedItemAndUpdate(itemBB);
        }
    }

    setOnInsert = (item) => {
        let SET_ON_INSERT_QUERY = { sku: item.sku };
        let update = {
            $setOnInsert: {
                sku: item.sku,
                name: item.name,
                link: item.link,
                price_timestamps: [{
                    price: item.currentPrice
                }]
            }
        };
        let options = { upsert: true };

        this.model.updateOne(SET_ON_INSERT_QUERY, update, options).then(result => {       //insert if sku not exists
            // console.log(`result:${JSON.stringify(result)}`)
            if (result.upserted) {
                console.log(`Inserted new item into DB on SKU: ${item.sku}`)
                return true;
            }
        });
        return false;
    }
    findPriceChangedItemAndUpdate(itemBB) {
        //aggregate find item that matched on sku in DB, then update price changed item.
        this.model.aggregate([
            {
                $project: {
                    link: 1,
                    name: 1,
                    sku: 1,
                    previousPrice: getCurPrice,     //tricky, get db current price which becomes prev price.
                    isCurrentPriceChanged: {        //check if capture price equal current price in db.
                        $ne: [
                            itemBB.currentPrice,       //lastest price from scrape
                            getCurPrice             //price in db
                        ]
                    }
                }
            },
            {
                $match: {
                    sku: itemBB.sku,
                    isCurrentPriceChanged: true
                }
            }
        ]).then(changedItems => {
            this.findSkuAndUpdate(changedItems, itemBB);
        })
    }

    findSkuAndUpdate(changedItems, itemBB) {

        let itemDB = changedItems.pop(); //aggregate array result; if item price changed, else pop empty arr and get null.
        let options = { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false }
        let update = {
            $push: {
                price_timestamps: {
                    price: itemBB.currentPrice
                }
            }
        }

        if (itemDB != null) {   //if found the price of itemSku changed
            this.model.findByIdAndUpdate(itemDB._id, update, options).then(item => {
                console.log(`Update price changed item in DB on SKU:${item.sku}\n${JSON5.stringify(item)}\n`)
            })
        } else {
            console.log(`Item exists, Price not Changed: ${itemBB.sku}`);
        }
    }



}

module.exports = {
    BBScript: BBScript,
    BBNumScript: BBNumScript,
    BBSkuItemScript: BBSkuItemScript,
   
}