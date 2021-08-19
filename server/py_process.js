const { spawn } = require('child_process')
const Item = require('./models/Item')

const py_process = (search_listings) => {
    //find all price tracking list
    // const docs = await Item.find();
    const json_str = JSON.stringify(search_listings)

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

        //for each item in product_price_listing run python script scrape price and title
        for (let i = 0; i < productPriceList.length; i++) {

            const price_timestamp = {
                price: "999"
            }
            Item.findByIdAndUpdate(productPriceList[i]._id, {
                name: productPriceList[i].name,
            }, {
                $push: {
                    price_timestamps:price_timestamp
                }
            },{ useFindAndModify: false }, (err, docs) => {
                if (err) {
                    console.log(`[Error]Update name and price by _id: ${productPriceList[i]._id} Failure`)
                } else {
                    console.log(`Updated _id: ${productPriceList[i]._id} Success`)
                }
            });
        }
    });

    // python.stderr.on('data', (data) => {
    //     console.log(`[ERROR] child process failure`);
    // })

}

module.exports = {
    py_process: py_process

}