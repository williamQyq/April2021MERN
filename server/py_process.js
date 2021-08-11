const express = require('express')
const { spawn } = require('child_process')
const py_app = express()
const py_port = 4000
const Item = require('./models/Item')
const mongoose = require('mongoose')

const PythonShell = require('python-shell');

const py_process = async () => {
    //find all price tracking list
    const docs = await Item.find();
    const asJson = JSON.stringify(docs)
    //console.log(asJson)
    py_app.get('/', (req, res) => {
        let productPriceList;
        
        const python = spawn('python', ['./python_packages/priceTracker.py', asJson]);
        python.stdout.on('data', (data) => {
            console.log('Pipe data from python script...');
            productPriceList = JSON.parse(data.toString());
            dataString = data.toString();
        });
        python.on('close', (code) => {
            console.log(`child process close all stdio with code ${code}`);
            res.send(dataString)
            
            //for each item in product_price_listing run python script scrape price and title
            for(let i = 0; i< productPriceList.length; i++){
                console.log(productPriceList[i])
                Item.findByIdAndUpdate(productPriceList[i]._id, {
                    name: productPriceList[i].name,
                    price: productPriceList[i].price
                }, (err, docs) => {
                    if(err){
                        console.log(`[Error]Update name and price by _id: ${productPriceList[i]._id} Failure`)
                    } else {
                        console.log(`Updated _id: ${productPriceList._id} Success`)
                    }
                });
            }

        });
        python.stderr.on('data', (data) => {
            console.log(`[ERROR] child process failure`);
        })

    });

    py_app.listen(py_port, () => {
        console.log(`example app listing on port ${py_port}`)
    })

}

module.exports = {
    py_process: py_process

}