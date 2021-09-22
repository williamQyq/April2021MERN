const { spawn } = require('child_process');
const JSON5 = require('json5')
const Item = require('../models/Item');
const BBItem = require('../models/BBItem');
const { Product } = require('../models/PriceProduct');

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
    }
    spawnScript(arg) {
        let arg_strfy = JSON.stringify(arg);
        console.log(`Start crawling...`)
        return spawn('python', [this.script_path,arg_strfy]);
    }

    spawnlinkScript(_id, link) {
        const product = new Product(_id, link);
        const product_arg = JSON.stringify(product);
        console.log(`Start crawling product price...: ${product_arg}`)
        return spawn('python', [this.script_path, product_arg]);
    }

    listenOn(python) {
        python.stdout.on('data', (data) => {
            console.log('Pipe data from script...');
            this.data = JSON5.parse(data.toString());
        })
    }
    listenClose(python,resolve) {
        python.on('close', (code) => {
            console.log(`child process close all stdio with code ${code}`);
            resolve();
        })
    }
    listenErr(python,reject) {
        python.on('error',()=>{
            console.log(`child process close with ERROR`);
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
        this.link = `https://www.bestbuy.com/site/searchpage.jsp?_dyncharset=UTF-8&browsedCategory=pcmcat138500050001&cp=1&id=pcat17071&iht=n&ks=960&list=y&qp=condition_facet%3DCondition~New&sc=Global&st=categoryid%24pcmcat138500050001&type=page&usc=All%20Categories`
    }

    initLinks(item_num) {
        let links = [];
        for (let i = 1; i <= Math.ceil(item_num / 24); i++) {
            links.push(`https://www.bestbuy.com/site/searchpage.jsp?_dyncharset=UTF-8&browsedCategory=pcmcat138500050001&cp=${i}&id=pcat17071&iht=n&ks=960&list=y&qp=condition_facet%3DCondition~New&sc=Global&st=categoryid%24pcmcat138500050001&type=page&usc=All%20Categories`)
        }
        return links;
    }

}
class BBSkuItemScript extends Script {
    constructor(model) {
        super(model);
        this.script_path = './script_packages/bbSkuItem.py';

    }
    // listenOn(python) {
    //     python.stdout.on('data', (data) => {
    //         console.log('Pipe data from script...');
    //         this.data = JSON.parse(data.toString());
    //         // this.result = JSON.parse(data.toString());
    //     })
    // }
    findSkuAndUpdate(item){
        let query = { sku:item.sku },
            update = { 
                name:item.name,
                link:item.link,
                price_timestamps: [{
                    price: item.currentPrice
                }]
            },
            options = { upsert: true, new:true, setDefaultsOnInsert:true, useFindAndModify: false }

        this.model.findOneAndUpdate(query, update, options, (err,doc) => {
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
        BBNum.listenClose(python,resolve);
        BBNum.listenErr(python,reject);
    });

    //1. get bb sku-items num then
    //2. Each laptops page contains 24 sku items, calculate and init array of links.
    //3. for each page, for each sku item, findskuAndUpdate.
    getBBNumPromise.then(() => {
        const item_num = BBNum.data;
        // const links = BBNum.initLinks(item_num);
        const links = BBNum.initLinks(100);
        links.forEach((link) => {
            const sku_items_python = BBSkuItem.spawnScript(link);
            BBSkuItem.listenOn(sku_items_python);
            const getBBSkuItemsPromise = new Promise((resolve, reject) => {
                BBSkuItem.listenClose(sku_items_python, resolve);
                BBSkuItem.listenErr(python,reject);
            });
            getBBSkuItemsPromise.then(()=>{
                const sku_items = BBSkuItem.data;
                sku_items.forEach((item)=>{
                    BBSkuItem.findSkuAndUpdate(item);
                })
                
            })
        });


    }, () => {
        console.log("BB Script Failure.");
    })

}

module.exports = {
    py_process: py_process,
    py_clock_cycle: py_clock_cycle,
    py_bb_process: py_bb_process,
}