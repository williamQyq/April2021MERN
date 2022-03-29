import cron from 'node-cron';
import { bucket } from './RateLimiter.js'
import {
    findAllProdPricing,
    findProdPricingOnUpc,
    saveProdPricingOffer
} from '../query/utilities.js'
// cron scheduler update Amazon sku
// export const amazonScheduler = cron.schedule("* * 1 * * *", async () => {
//     await getSellingPartnerProdPricing()
// });

export const amazonScheduler = async () => {
    await getSellingPartnerProdPricing();

};

export const getSellingPartnerProdPricing = async () => {
    await findAllProdPricing().then(prods => {
        prods.forEach(prod => {
            let sp = new ProdPricing();
            let tasks = sp.createTasks(prod)
            bucket.addTasks(tasks)
        })
    })
    await bucket.start().then(taskResults => {
        saveProdPricingOffers(taskResults)
    })
}


const saveProdPricingOffers = (taskResults) => {
    taskResults.forEach(res => {
        let upc = res.upc;
        let asinOffers = res.sellingPartnerResponse;
        asinOffers.forEach(skuOffer => {
            let asin = skuOffer.ASIN;
            let offers = skuOffer.Product.Offers;
            saveProdPricingOffer(upc, asin, offers)
                .then(res => console.log(`[Amazon SP] UPC:${res.upc} updated #[${asin}]# asin succeed.`))
                .catch(err => console.log(`[ERR]: amz save offers err.\n${err}`))
        })
    })
}