import cron from 'node-cron';
import { bucket } from './RateLimiter.js'
import {
    findAllProdPricing,
    findProdPricingOnUpc,
    updateProdPricingOffer
} from '#query/utilities.js'
import ProdPricing from './SPAPI/ProdPricing.js';
// cron scheduler update Amazon sku
// export const amazonScheduler = cron.schedule("* * 1 * * *", async () => {
//     await getSellingPartnerProdPricing()
// });

export const amazonScheduler = async () => {
    await findAllProdPricing()
        .then(prods => getSellingPartnerProdPricing(prods));

};

/* 
    @desc:  Retrieve AMZ ProdPricing for each task in bucket queue
    @param: prods: Array<ProductAsinsMapping>

*/
export const getSellingPartnerProdPricing = (prods) => {
    let sp = new ProdPricing();
    prods.forEach(prod => {
        let tasks = sp.createTasks(prod)    //list of tasks, each task contain upc and maximum 20 asins mapping.
        bucket.addTasks(tasks)
    })
    bucket.start()
        .then(taskResults => updateProdPricingOffers(taskResults))
}

/* 
    @desc: For each SP ProdPricing API task response, update asin offers.
    @param: taskResult: Array<{upc:string,sellingPartnerResponse:Array<ProdPricingApiASINRes>}>
    @return: void
*/
const updateProdPricingOffers = async (taskResults) => {
    const validTaskResults = taskResults.filter(res => res.upc != undefined && res.sellingPartnerResponse != undefined)

    validTaskResults.forEach(result => {
        let { upc, sellingPartnerResponse } = result;

        //jump to next ProdPricing offer if contains undefined
        sellingPartnerResponse.forEach(skuOffer => {
            let asin = skuOffer.ASIN;
            let offers = skuOffer.Product.Offers;

            if (upc === undefined || asin === undefined || offers === undefined) {
                return;
            }

            updateProdPricingOffer(upc, asin, offers)
                .then(res => console.log(`[Amazon SP] UPC:${res.upc} updated #[${asin}]# asin succeed.`))
                .catch(err => console.log(`\n***[ERR]: Save ProductPricing offer to database err.\n${err}\n`))
        });
    })
}