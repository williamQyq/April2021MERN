const cron = require('node-cron');
const { bucket } = require('./RateLimiter.js')
const {
    findAllProdPricing,
    setProdPricingOffer
} = require('../query/utitlities')
// cron scheduler update Amazon sku
const amazonScheduler = cron.schedule("* * 1 * * *", async () => {
    await getSellingPartnerProdPricing()
});

// const amazonScheduler = async () => {
//     await getSellingPartnerProdPricing();

// };

const getSellingPartnerProdPricing = async () =>
    //get prods asins in database 
    findAllProdPricing().then(prods => {
        prods.forEach(prod => {
            const upcAsinMapping = bucket.getProdAsins(prod);
            bucket.addProdPricingTask(upcAsinMapping);
        })

        bucket.doTaskQueue()
            .then(offers => {
                saveOffers(offers)
            })
            .catch(e => {
                console.log(`undefined task****\n ${e}`)
            });
        // bucket.throttle(30);
    })

const saveOffers = (offers) => {
    offers.forEach(prod => {
        prod.prom.forEach(asin => {
            // console.log(`amzAsinRes========\n`, JSON.stringify(amzAsinRes.ASIN, null, 4))
            setProdPricingOffer({
                upc: prod.upc,
                asin: asin.ASIN,
                offers: asin.Product.Offers
            })
                .then(res => console.log(`[Amazon SP] UPC:${res.upc} updated #[${asin.ASIN}]# asin succeed.`))
                .catch(err => console.log(`[ERR]: amz save offers err.\n${err}`))
        })
    })
}


module.exports = {
    amazonScheduler,
    getSellingPartnerProdPricing
}