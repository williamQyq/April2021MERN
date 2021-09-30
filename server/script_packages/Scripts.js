const { spawn } = require('child_process');
const { Product } = require('../models/PriceProduct');
const JSON5 = require('json5');


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
class BBScript extends Script{
    constructor(model){
        super(model);
        this.script_path = './script_packages/priceTracker.py';
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
        this.link = `https://www.bestbuy.com/site/searchpage.jsp?_dyncharset=UTF-8&browsedCategory=pcmcat138500050001&id=pcat17071&iht=n&ks=960&list=y&qp=condition_facet%3DCondition~New%5Eparent_operatingsystem_facet%3DParent%20Operating%20System~Windows&sc=Global&st=categoryid%24pcmcat138500050001&type=page&usc=All%20Categories`
    }
    listenOn(python) {
        python.stdout.pipe(require('JSONStream').parse()).on('data',(data)=>{
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

module.exports ={
    BBScript: BBScript,
    BBNumScript: BBNumScript,
    BBSkuItemScript: BBSkuItemScript,
}