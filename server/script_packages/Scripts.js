const spawn = require('child_process').execFile;
const JSONStream = require('JSONStream');
const { LAST_PRICE } = require('../query/aggregate.js');

// Script class, integrate python scripts into nodejs
class Script {
    constructor(model) {
        this.model = model;
        this.storeName = "";
        this.count = 0;
    }
    spawnScript(scriptPath, arg) {
        arg = JSON.stringify(arg);
        console.log(`[Script] Start running ${this.constructor.name}...`)
        return spawn('python', [scriptPath, arg]);
    }
    listenOn(python, callback) {
        python.stdout.pipe(JSONStream.parse()).on('data', (data) => {
            callback(data)
        })
    }
    listenClose(python, resolve) {
        python.on('exit', (code) => {
            resolve(`\n${this.constructor.name} child process close all stdio with code ${code}`);
        })
    }
    listenErr(python, reject) {
        python.on('error', err => {

            reject(`\n***ERROR ${this.constructor.name}:\n${err}`);
        })
    }
    getLinkInfo(totalNum, numPerPage) {     //return link and calculate the # of pages need to loop.
        return ({
            link: this.link,
            pages: Math.ceil(totalNum / numPerPage)
        })
    }

    async insertAndUpdatePriceChangedItem(item) {
        item.currentPrice = Number(item.currentPrice)
        let isInsert = await this.setOnInsert(item); //true if insert new item; false if item exists.

        //not insert, has doc in db
        if (!isInsert) {
            await this.findPriceChangedItemAndUpdate(item);
        }
        this.count++;
    }

    async setOnInsert(item) {
        let SET_ON_INSERT_QUERY = { sku: item.sku };
        let isInsert = false;

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

        await this.model.updateOne(SET_ON_INSERT_QUERY, update, options).then(result => {       //insert if sku not exists
            // console.log(`result:${JSON.stringify(result)}`)
            if (result.upserted) {
                console.log(`# ${this.count} ${this.storeName} Inserted new item into DB on SKU: ${item.sku}`)
                isInsert = true
            }
        });

        return isInsert;
    }

    async findPriceChangedItemAndUpdate(item) {
        //aggregate find item that matched on sku in DB, then update price changed item.
        await this.model.aggregate([
            {
                $project: {
                    sku: 1,
                    updatePrice: item.currentPrice,
                    isPriceChanged: {        //check if capture price equal current price in db.
                        $ne: [
                            item.currentPrice,       //lastest price from scrape
                            LAST_PRICE             //price in db
                        ]
                    }
                }
            },
            {
                $match: {
                    sku: item.sku,
                    isPriceChanged: true
                }
            }
        ]).then(docs => {
            if (docs.length != 0) {
                docs.forEach(async (doc) => {
                    await this.pushUpdatedPrice(doc, item)
                })
            } else {
                console.log(`# ${this.count} ${this.storeName} Item exists, Price not Changed: ${item.sku}`);
            }
        })
    }

    async pushUpdatedPrice(doc, item) {
        let options = { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false }
        let update = {
            $push: {
                price_timestamps: {
                    price: item.currentPrice
                }
            }
        }

        await this.model.findByIdAndUpdate(doc._id, update, options).then(item => {
            console.log(`# ${this.count} ${this.storeName} Update price changed item in DB on SKU:${item.sku}\n`)
            // console.log(`${JSON5.stringify(item)}\n`)
        })
    }

    exec(scriptPath, argv, callback) {
        const python = this.spawnScript(scriptPath, argv);
        this.listenOn(python, callback);
        return new Promise((resolve, reject) => {
            this.listenClose(python, resolve);
            this.listenErr(python, reject);
        })
    }
}

class Bestbuy extends Script {
    constructor(model) {
        super(model);
        this.storeName = "Bestbuy";
        this.link = `https://www.bestbuy.com/site/searchpage.jsp?_dyncharset=UTF-8&browsedCategory=pcmcat138500050001&cp=1&id=pcat17071&iht=n&ks=960&list=y&qp=condition_facet%3DCondition~New&sc=Global&st=categoryid%24pcmcat138500050001&type=page&usc=All%20Categories`;
        this.linkSearchScriptPath = './script_packages/scrape_bb_item_on_sku.py';
        this.pageNumScriptPath = './script_packages/scrape_bb_laptops_num.py';
        this.skuItemScriptPath = './script_packages/scrape_bb_items.py';
        this.itemConfigScriptPath = './script_packages/scrape_bb_config_on_sku.py';
    }

    async insertAndUpdatePriceChangedItem(item) {
        if (!isNaN(item.sku)) {
            item.currentPrice = Number(item.currentPrice)
            let isInsert = await this.setOnInsert(item); //true if insert new item; false if item exists.

            //not insert, has doc in db
            if (!isInsert) {
                await this.findPriceChangedItemAndUpdate(item);
            }
        } else {
            console.log(`# ${this.count} ${this.storeName} Attention**, this item does not have number sku. Skip: ${item.sku}`);
        }
        this.count++
    }
    upsertItemConfig(item) {
        // console.log(`config:\n${JSON.stringify(item, null, 4)}`)
    }

}


class KeepaScript extends Script {
    constructor(searchTerm) {
        super(undefined, searchTerm);

        this.searchTerm = searchTerm;
        this.script_path = './script_packages/keepa_stat.py';
    }

}

class Microsoft extends Script {
    constructor(model) {
        super(model);
        this.storeName = "Microsoft";
        this.link = 'https://www.microsoft.com/en-us/store/b/shop-all-pcs?categories=2+in+1||Laptops||Desktops||PC+Gaming&s=store&skipitems=';
        this.pageNumScriptPath = './script_packages/scrape_ms_laptops_num.py';
        this.skuItemScriptPath = './script_packages/scrape_ms_items.py';
    }
}

module.exports = {
    Bestbuy,
    KeepaScript,
    Microsoft,
    Script
}