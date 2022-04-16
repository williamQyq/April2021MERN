import cron from 'node-cron';
import moment from 'moment';
import { bucket } from './RateLimiter.js'
import {
    findAllProdPricing,
    findProdPricingOnUpc,
    updateProdPricingOffer
} from '#query/utilities.js'
import ProdPricing from './SPAPI/ProdPricing.js';
// cron scheduler update Amazon sku
export const amazonScheduler = cron.schedule("0 */10 * * * *", async () => {
    await findAllProdPricing()
        .then(prods => getSellingPartnerProdPricing(prods))

});
// export const amazonScheduler = async () => {
//     await findAllProdPricing()
//         .then(prods => getSellingPartnerProdPricing(prods));

// };

/* 
    @desc:  Retrieve AMZ ProdPricing for each task in bucket queue
    @param: prods: Array<ProductAsinsMapping>

*/
export const getSellingPartnerProdPricing = async (prods) => {
    let sp = new ProdPricing();
    prods.forEach(prod => {
        let tasks = sp.createTasks(prod)    //list of tasks, each task contain upc and maximum 20 asins mapping.
        bucket.addTasks(tasks)
    })
    await bucket.start()
        .then(taskResults => updateProdPricingOffers(taskResults))
}

/* 
    @desc: For each SP ProdPricing API task response, update asin offers.
    @param: taskResult: Array<{upc:string,sellingPartnerResponse:Array<ProdPricingApiASINRes>}>
    @return: Promise.allSettled(validTaskResults)
*/
const updateProdPricingOffers = async (taskResults) => {
    let validTaskResults = taskResults
        .filter(res => res.upc != undefined && res.sellingPartnerResponse != undefined)
        .reduce((mergedTasks, curTask) => {
            let { upc, sellingPartnerResponse } = curTask;

            //for each sku offer in response push updatePromise to merged Promises
            sellingPartnerResponse.forEach(skuOffer => {
                let asin = skuOffer.ASIN;
                let offers = skuOffer.Product.Offers;
                if (upc === undefined || asin === undefined || offers === undefined) {
                    return;
                }
                //push update Promise to merged Promises
                mergedTasks.push(updateProdPricingOffer(upc, asin, offers)
                    .then(res => {
                        console.log(`[Amazon SP] UPC:${res.upc} updated #[${asin}]# asin succeed.`)
                    })
                    .catch(err => {
                        console.log(`\n***[ERR]: Save ProductPricing offer to database err.\n${err}\n`)
                        throw (err)
                    })
                )
            })
            return mergedTasks
        }, [])

    return Promise.allSettled(validTaskResults)
        .then(results => {
            console.log(`[Amazon SP] task all finished - ${moment().format('MMMM Do YYYY, h:mm:ss a')}`)
            let failedTasks = results.filter(result => result.status == "rejected")
            if (failedTasks.length > 0)
                console.error(failedTasks)
        })
}