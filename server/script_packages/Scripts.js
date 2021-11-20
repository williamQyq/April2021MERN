const { spawn } = require('child_process');
const { Product } = require('../models/PriceProduct.js');
const JSON5 = require('json5');
const JSONStream = require('JSONStream');

const { getCurPrice } = require('../query/aggregate.js');

// Script class, integrate python scripts into nodejs
class Script {
    constructor(model, arg = undefined) {
        this.model = model;
        this.arg = arg;
    }
    spawnScript(scriptPath, arg) {
        arg = JSON.stringify(arg);
        console.log(`[Script] Start running ${this.constructor.name}...`)
        return spawn('python', [scriptPath, arg]);
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
            resolve(this.data);
        })
    }
    listenErr(python, reject) {
        python.on('uncaughtException', err => {

            reject(`\nERROR ${this.constructor.name}: ${err}`);
        })
    }

    // updateDBPriceById(Model, product) {
    //     //update price and name returned from python script, push price_timestamp into price_timestamps
    //     Model.findByIdAndUpdate(product.id, {
    //         name: product.name,
    //         $push: {
    //             price_timestamps: {
    //                 price: product.currentPrice,
    //             }
    //         }
    //     }, { useFindAndModify: false }, (err, docs) => {
    //         if (err) {
    //             console.log(`[Error]Update name and price by _id: ${product.id} Failure`)
    //         } else {
    //             console.log(`Updated _id: ${product.id} Success`)
    //         }
    //     });

    //     console.log(`Updated price timestamps, name of product in DB...:\n${JSON5.stringify(product)}`)
    // }

}

class BBScript extends Script {
    constructor(model) {
        super(model);
        this.script_path = './script_packages/scrape_bb_item_on_sku.py';
        this.link = `https://www.bestbuy.com/site/searchpage.jsp?_dyncharset=UTF-8&browsedCategory=pcmcat138500050001&id=pcat17071&iht=n&ks=960&list=y&qp=condition_facet%3DCondition~New&sc=Global&st=categoryid%24pcmcat138500050001&type=page&usc=All%20Categories`;
    }
}

class BBNumScript extends BBScript {
    constructor(model) {
        super(model);
        this.script_path = './script_packages/scrape_bb_laptops_num.py';
    }

}

class BBSkuItemScript extends BBScript {
    count = 0;
    constructor(model) {
        super(model);
        this.script_path = './script_packages/scrape_bb_items.py';
    }

    listenOn(python) {
        python.stdout.pipe(JSONStream.parse()).on('data', (data) => {
            if (!isNaN(data.sku)) {   //validate non package sku items
                data.sku = Number(data.sku);
                data.currentPrice = Number(data.currentPrice);    //tricky, convert data.currentPrice from string to number, instead of parseFloat toFixed.
                this.insertAndUpdateItem(data);
            } else {
                console.log(`# ${this.count} Attention**, this item does not have sku. Skip: ${data.sku}`);
                this.count += 1;
            }

        })
    }
    listenClose(python, resolve) {
        python.on('exit', (code) => {
            resolve(`\n${this.constructor.name} child process close with code: ${code}`);
        })
    }

    getLinkInfo(totalNum, numPerPage) {     //return link and calculate the # of pages need to loop.
        return ({
            link: this.link,
            link_index: Math.ceil(totalNum / numPerPage)
        })
    }

    insertAndUpdateItem(item) {
        let isSkuInsert = this.setOnInsert(item); //true if insert new item; false if item exists.

        if (!isSkuInsert) {
            this.findPriceChangedItemAndUpdate(item);
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
                console.log(`# ${this.count} Inserted new item into DB on SKU: ${item.sku}`)
                this.count += 1;
                return true;
            }
        });
        return false;
    }

    findPriceChangedItemAndUpdate(item) {
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
                            item.currentPrice,       //lastest price from scrape
                            getCurPrice             //price in db
                        ]
                    }
                }
            },
            {
                $match: {
                    sku: item.sku,
                    isCurrentPriceChanged: true
                }
            }
        ]).then(changedItems => {
            this.findSkuAndUpdate(changedItems, item);
        })
    }

    findSkuAndUpdate(changedItems, item) {

        let itemInDatabase = changedItems.pop(); //aggregate array result; if item price changed, else pop empty arr and get null.
        let options = { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false }
        let update = {
            $push: {
                price_timestamps: {
                    price: item.currentPrice
                }
            }
        }

        if (itemInDatabase != null) {   //if found match item in database and the price of itemSku is changed
            this.model.findByIdAndUpdate(itemInDatabase._id, update, options).then(item => {
                console.log(`# ${this.count} Update price changed item in DB on SKU:${item.sku}\n${JSON5.stringify(item)}\n`)
                this.count += 1;
            })
        } else {
            console.log(`# ${this.count} Item exists, Price not Changed: ${item.sku}`);
            this.count += 1;
        }
    }

}

class KeepaScript extends Script {
    constructor(searchTerm) {
        super(undefined, searchTerm);

        this.searchTerm = searchTerm;
        this.script_path = './script_packages/keepa_stat.py';
    }

}

class MsScript extends Script {
    constructor(model) {
        super(model);
        this.link = 'https://www.microsoft.com/en-us/store/b/shop-all-pcs?categories=2+in+1||Laptops||Desktops||PC+Gaming';
        this.pageNumScriptPath = './script_packages/scrape_ms_laptops_num.py';
        this.skuItemScriptPath = './script_packages/scrape_ms_items.py';
    }
}
class MsSkuItemScript extends MsScript {
    constructor(model) {
        super(model);
    }
    listenOn() {

    }
    listenClose() {

    }
}

module.exports = {
    BBScript: BBScript,
    BBNumScript: BBNumScript,
    BBSkuItemScript: BBSkuItemScript,
    KeepaScript: KeepaScript,
    MsScript: MsScript

}