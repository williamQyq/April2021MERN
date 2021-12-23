const cron = require('node-cron');
const { ProdPricing } = require('../models/Amz')
const { amazonSellingPartner, SpBucket } = require('./RateLimiter.js')
const { performance } = require('perf_hooks');

//cron scheduler update Amazon sku
// const amazonScheduler = cron.schedule("00 19 10 * * *", () => {
//     productPricingCheck();


// });


const amazonScheduler = async () => {
    productPricingUpdate();

};




const productPricingUpdate = () => {
    const bucket = new SpBucket();

    //get prods asins in database 
    findAllProds().then(prods => {
        prods.forEach((prod, index) => {
            let asins = bucket.getProdAsins(prod);
            bucket.addProdPricingTasks(asins);
        })
        // bucket.doTaskQueue();
        // bucket.throttle();

    })
}


const delay = ms => new Promise(res => setTimeout(res, ms));

const findAllProds = () => {
    return ProdPricing.find()
}


module.exports = { amazonScheduler: amazonScheduler }