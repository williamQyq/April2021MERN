const cron = require('node-cron');
const { ProdPricing } = require('../models/Amz')
const { SpBucket } = require('./RateLimiter.js')

// cron scheduler update Amazon sku
// const amazonScheduler = cron.schedule("* 10 * * * *", () => {
//     productPricingCheck();
// });

const amazonScheduler = () => {
    productPricingUpdate();

};

const productPricingUpdate = () => {
    const bucket = new SpBucket();

    //get prods asins in database 
    ProdPricing.find().then(prods => {
        prods.forEach(prod => {
            const asins = bucket.getProdAsins(prod);
            bucket.addProdPricingTasks(asins);
            bucket.doTaskQueue()
                .then(amzRes => {
                    saveOffers(amzRes, prod.upc);
                }).catch(e => {
                    console.log(`undefined task****\n ${e}`)
                });
            // bucket.throttle();
        })
    })
}

const saveOffers = (res, upc) => {
    res.forEach(amzProdRes => {
        amzProdRes.forEach(amzAsinRes => {
            // console.log(`amzAsinRes========\n`, JSON.stringify(amzAsinRes.ASIN, null, 4))
            const filter = { "upc": upc, "identifiers.asin": amzAsinRes.ASIN }
            const update = { $set: { "identifiers.$.offers": amzAsinRes.Product.Offers } }
            const option = { useFindAndModify: false }
            ProdPricing.findOneAndUpdate(filter, update, option)
                .then(res => console.log(`[Amazon SP] UPC:${res.upc} updated #${res.identifiers.length} asins succeed.`))
                .catch(err => console.log(`[ERR]: amz save offers err.\n${err}`))
        })
    })
    // const query = findAsinOffer(res.)

}


module.exports = { amazonScheduler: amazonScheduler }