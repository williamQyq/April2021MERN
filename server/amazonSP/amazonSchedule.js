const cron = require('node-cron');
const { ProdPricing } = require('../models/Amz')
const { SpBucket } = require('./RateLimiter.js')

// cron scheduler update Amazon sku
// const amazonScheduler = cron.schedule("* 10 * * * *", () => {
//     productPricingCheck();
// });

const amazonScheduler = () => {
    // productPricingUpdate();

};

const productPricingUpdate = () => {
    const bucket = new SpBucket();

    //get prods asins in database 
    ProdPricing.find().then(prods => {
        prods.forEach(prod => {
            const upcAsinMapping = bucket.getProdAsins(prod);
            bucket.addProdPricingTask(upcAsinMapping);
        })

        bucket.doTaskQueue()
            .then(amzRes => {
                saveOffers(amzRes);
            }).catch(e => {
                console.log(`undefined task****\n ${e}`)
            });
        // bucket.throttle();
    })
}

const saveOffers = (res) => {
    res.forEach(prodPricRes => {
        prodPricRes.prom.forEach(asinPricRes => {
            // console.log(`amzAsinRes========\n`, JSON.stringify(amzAsinRes.ASIN, null, 4))
            const filter = { "upc": prodPricRes.upc, "identifiers.asin": asinPricRes.ASIN }
            const update = { $set: { "identifiers.$.offers": asinPricRes.Product.Offers } }
            const option = { useFindAndModify: false }
            ProdPricing.findOneAndUpdate(filter, update, option)
                .then(res => console.log(`[Amazon SP] UPC:${res.upc} updated #[${asinPricRes.ASIN}]# asin succeed.`))
                .catch(err => console.log(`[ERR]: amz save offers err.\n${err}`))
        })
    })
}


module.exports = { amazonScheduler: amazonScheduler }