const { spawn } = require('child_process');
const Item = require('../models/Item');
const BBItem = require('../models/BBItem');
const { Product } = require('../models/PriceProduct');

class Script {
    constructor(_id = null, link = null, model) {
        this._id = _id;
        this.link = link;
        this.model = model;
        this.script_path = './script_packages/priceTracker.py';
    }
    spawnScript() {
        const product = new Product(this._id, this.link);
        const product_arg = JSON.stringify(product);
        console.log(`Start crawling product price...: ${product_arg}`)
        return spawn('python', [this.script_path, product_arg]);
    }

    listenOn(python) {
        python.stdout.on('data', (data) => {
            console.log('Pipe data from script...');
            this.data = JSON.parse(data.toString());
        })
    }

    listenClose(python) {
        python.on('close', (code) => {
            console.log(`child process close all stdio with code ${code}`);
            this.updateDB(this.model, this.product);
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
        this.get_items_num_script_path = './script_packages/bbLaptopsNum.py';
        this.links = [];
        this.allLaptopsLink = 'https://www.bestbuy.com/site/searchpage.jsp?_dyncharset=UTF-8&browsedCategory=pcmcat138500050001&cp=1&id=pcat17071&iht=n&ks=960&list=y&qp=condition_facet%3DCondition~New&sc=Global&st=categoryid%24pcmcat138500050001&type=page&usc=All%20Categories';
    }

    spawnScript() {
        console.log(`Start crawling BB all laptops Num...`)
        return spawn('python', [this.get_items_num_script_path]);
    }

    numScriptListenOn(python) {
        python.stdout.on('data', (data) => {
            console.log('Pipe data from script...');
            this.data = JSON.parse(data.toString());
        })
    }
    numScriptListenClose(python) {
        python.on('close', (code) => {
            console.log(`child process close all stdio with code ${code}`);
            return this.data;
        })
        return false;
    }
    spawnScript() {
        const product = new Product(this._id, this.link);
        const product_arg = JSON.stringify(product);
        console.log(`Start crawling product price...: ${product_arg}`)
        return spawn('python', [this.script_path, json_str, product_arg]);
    }

    initLinks() {
        


    }

}

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
    Item.findByIdAndUpdate(product._id, {
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
}


const py_clock_cycle = async () => {

    const items = await Item.find({}).then(items => {
        items.forEach((item => {
            py_process(item._id, item.link);
        }))
    });

}

// load bb Condition New all products lists
const py_bb_process = () => {
    const BB = new BBScript();

    //spawn script to get items number
    const python = BB.spawnScript();
    //listen for script stdout
    BB.listenOn(python);
    //listen closed then for each sku-item save to DB
    BB.listenClose(python).then(() => {
        links = BB.initLinks();

        links.forEach((link) => {
            const python = BB.spawnScript();
            BB.listenOn(python);
            BB.listenClose(python).then(() => {
                BB.sku_items.forEach((sku_item) => {
                    BBItem.findOneAndUpdate({ sku: sku_item.sku },{
                        $push: {
                            price_timestamps: {
                            price: sku_item.currentPrice,
                            }
                        }})
                })
            })
        })
    })


}

module.exports = {
    py_process: py_process,
    py_clock_cycle: py_clock_cycle,
    py_bb_process: py_bb_process,
}