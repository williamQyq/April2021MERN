const { json } = require('body-parser')
const { spawn } = require('child_process')
const Item = require('./models/Item')

const py_process = (search_listings) => {

    const json_str = JSON.stringify(search_listings)
    console.log(`json_str: \n${json_str}`)

    let productPriceList, dataString;
    const python = spawn('python', ['./python_packages/priceTracker.py', json_str]);
    console.log(`Python script start piping...`)

    python.stdout.on('data', (data) => {
        console.log('Pipe data from python script...');
        productPriceList = JSON.parse(data.toString());
        dataString = data.toString();
    });

    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        // res.send(dataString)
        console.log(`datastring from python child process: ${dataString}`)

        // for each item in product_price_listing run python script scrape price and title
        if (productPriceList) {
            for (let i = 0; i < productPriceList.length; i++) {

                //update price and name returned from python script, push price_timestamp into price_timestamps
                Item.findByIdAndUpdate(productPriceList[i]._id, {
                    name: productPriceList[i].name,
                    $push: {
                        price_timestamps: {
                            price: productPriceList[i].price_timestamp.price,
                        }
                    }
                }, { useFindAndModify: false }, (err, docs) => {
                    if (err) {
                        console.log(`[Error]Update name and price by _id: ${productPriceList[i]._id} Failure`)
                    } else {
                        console.log(`Updated _id: ${productPriceList[i]._id} Success`)
                    }
                });
            }
        }
    });

    // python.stderr.on('data', (data) => {
    //     console.log(`[ERROR] child process failure`);
    // })

}

module.exports = {
    py_process: py_process

}