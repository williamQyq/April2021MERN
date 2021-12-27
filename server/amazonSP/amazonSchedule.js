const cron = require('node-cron');
const { ProdPricing } = require('../models/Amz')
const { SpBucket } = require('./RateLimiter.js')

//cron scheduler update Amazon sku
// const amazonScheduler = cron.schedule("00 19 10 * * *", () => {
//     productPricingCheck();


// });


const amazonScheduler = async () => {
    // productPricingUpdate();

};




const productPricingUpdate = () => {
    const bucket = new SpBucket();

    //get prods asins in database 
    findAllProds().then(prods => {
        prods.forEach((prod, index) => {
            let asins = bucket.getProdAsins(prod);
            bucket.addProdPricingTasks(asins);
            bucket.doTaskQueue().then(res => {
                saveOffers(res);
            })
            // bucket.throttle();
        })
    })
}


const delay = ms => new Promise(res => setTimeout(res, ms));

const findAllProds = () => {
    return ProdPricing.find()
}

const saveOffers = (res) => {
    res.forEach(amzProdRes => {
        amzProdRes.forEach(amzAsinRes => {
            console.log(`asin::`, JSON.stringify(amzAsinRes.Product.Offers, null, 4))
            const filter = { "identifiers.asin": amzAsinRes.asinASIN }
            const update = { $set: { "identifiers.$.offers": amzAsinRes.Product.Offers } }
            const option = { useFindAndModify: false }
            ProdPricing.findOneAndUpdate(filter, update, option)
                .then(res => console.log(`succes`, res))
                .catch(err=>console.log())
        })
    })
    // const query = findAsinOffer(res.)

}


module.exports = { amazonScheduler: amazonScheduler }