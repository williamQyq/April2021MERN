import ProdPricing from './ProdPricing.js';
import { bucket } from '../RateLimiter.js';
import { updateProdPricingOffer, findAllProdPricing } from 'lib/query/deals.query'
import moment from 'moment'

/* 
@desc: Product Pricing API: getPricing
@param: prods:Array<AmzProdPricing>
@return: Void
*/
export const updateProdPricingCatalogItems = async () => {
    await findAllProdPricing()
        .then(prods => getSellingPartnerProdPricing(prods))
        .then(taskResults => updateProdPricingOffers(taskResults))
}
/* 
    @desc:  Retrieve AMZ ProdPricing for each task in bucket queue
    @param: prods: Array<ProductAsinsMapping>

*/
const getSellingPartnerProdPricing = (prods) => {
    console.log('\n\n[Amazon SP] ProdPricing tasks are being created...')
    let sp = new ProdPricing();
    prods.forEach(prod => {
        sp.createAndAddTasksToBucket(bucket, prod)    //list of tasks, each task contain upc and maximum 20 asins mapping.
    })
    return bucket.start()   //return the task response retrieved from SP-Api endpoints
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
                //push executed update Promise to merged Promises
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