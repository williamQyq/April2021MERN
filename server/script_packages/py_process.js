const { spawn } = require('child_process');
const Item = require('../models/Item');
const BBItem = require('../models/BBItem');
const { Product } = require('../models/PriceProduct');
const { resolve } = require('path');

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
    spawnScript() {
        console.log(`Start crawling...`)
        return spawn('python', [this.script_path]);
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
            this.data = data.toString();
            // this.result = JSON.parse(data.toString());
        })
    }
    listenClose(python) {
        python.on('close', (code) => {
            console.log(`child process close all stdio with code ${code}`);
        })
    }
    listenCloseAndUpdate(python, Model) {
        python.on('close', (code) => {
            console.log(`child process close all stdio with code ${code}`);
            this.updateDB(Model, this.data);
        })
    }

    updateDB(Model, product) {
        console.log(`update${JSON.stringify(product)}`)
        //update price and name returned from python script, push price_timestamp into price_timestamps
        Model.findByIdAndUpdate(product._id, {
            name: product.name,
            $push: {
                price_timestamps: {
                    price: product.currentPrice,
                }
            }
        }, { useFindAndModify: false }, (err, docs) => {
            if (err) {
                console.log(`[Error]Update name and price by _id: ${product._id} Failure`)
            } else {
                console.log(`Updated _id: ${product._id} Success`)
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
    spawnScript(sku_items_link) {
        console.log(`Start crawling sku items...`)
        return spawn('python', [this.script_path,sku_items_link]);
    }

    listenCloseAndUpdateSkuItem(python,Model){
        python.on('close',(code) =>{
            console.log(`child process close all stdio with code ${code}`);
            this.findSkuAndUpdate(Model,this.data)
        })
    }
    findSkuAndUpdate(Model,sku_items){
        //Model.findOneAndUpdate(sku{})
    }

}


// load bb Condition New all products lists
//
const py_bb_process = () => {
    let BBNum = new BBScript(BBItem);
    let BBSkuItem = new BBSkuItemScript(BBItem);
    //spawn script to get items number
    const python = BBNum.spawnScript();

    // listen for script, get total items number
    BBNum.listenOn(python);
    const getBBNumPromise = new Promise((resolve, reject) => {
        BBNum.listenClose(python);
        setTimeout(() => {
            if (BBNum.data) {
                resolve("Success");
            } else {
                reject("failure");
            }
        }, 5000);
    });

    //1. get bb sku-items num then
    //2. Each laptops page contains 24 sku items, calculate and init array of links.
    //3. for each page, for each sku item, findskuAndUpdate.
    getBBNumPromise.then(() => {
        const item_num = BBNum.data;
        const links = BBNum.initLinks(item_num);
        // links.forEach((link) => {
        //     const sku_item_python = BBSkuItem.spawnScript(link);
        //     BBSkuItem.listenOn(sku_item_python);
        //     BBSkuItem.listenCloseAndUpdateSkuItem(sku_item_python, BBItem);
        // })

    }, () => {
        console.log("BB Script Failure.");
    })

}

module.exports = {
    py_process: py_process,
    py_clock_cycle: py_clock_cycle,
    py_bb_process: py_bb_process,
}