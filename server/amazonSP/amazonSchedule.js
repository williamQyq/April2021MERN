import cron from 'node-cron';
import { bucket } from './RateLimiter.js'
import {
    findAllProdPricing,
    findProdPricingOnUpc,
    updateProdPricingOffer
} from '../query/utilities.js'
import ProdPricing from './SPAPI/ProdPricing.js';
// cron scheduler update Amazon sku
// export const amazonScheduler = cron.schedule("* * 1 * * *", async () => {
//     await getSellingPartnerProdPricing()
// });

export const amazonScheduler = async () => {
    await findAllProdPricing()
        .then(prods => getSellingPartnerProdPricing(prods));

};

export const getSellingPartnerProdPricing = async (prods) => {

    prods.forEach(prod => {
        let sp = new ProdPricing();
        let tasks = sp.createTasks(prod)
        bucket.addTasks(tasks)
    })
    await bucket.start()
        .then(taskResults => updateProdPricingOffers(taskResults))
        .finally(() => {
            console.log('bucket task queue finished')
        })
}

/* 
    @desc: For each SP ProdPricing API task response, update asin offers.
    @param: taskResult: Array<{upc:string,sellingPartnerResponse:Array<ProdPricingApiASINRes>}>
    @return: void
*/
const updateProdPricingOffers = async (taskResults) => {
    const validTasks = taskResults.filter(res => res.upc != null)

    for (let res of validTasks) {
        let upc = res.upc;
        let asinOffers = res.sellingPartnerResponse;
        if (asinOffers === undefined) {
            console.log(`asinOffers undefined`, res)
        }
        for (let skuOffer of asinOffers) {
            let asin = skuOffer.ASIN;
            let offers = skuOffer.Product.Offers;
            updateProdPricingOffer(upc, asin, offers)
                .then(res => console.log(`[Amazon SP] UPC:${res.upc} updated #[${asin}]# asin succeed.`))
                .catch(err => console.log(`\n***[ERR]: Save ProductPricing offer to database err.\n${err}\n`))
        }
    }
}