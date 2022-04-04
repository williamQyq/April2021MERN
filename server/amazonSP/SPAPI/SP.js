import ProdPricing from './ProdPricing.js';
import { bucket } from '../RateLimiter.js';

/* 
@desc: Product Pricing API: getPricing
@param: prods:Array<AmzProdPricing>
@return: Void
*/
export const getCatalogItems = async (prods) => {
    let res;
    let sp = new ProdPricing();

    //create tasks for each prod
    prods.forEach(prod => {
        let tasks = sp.createTasks(prod);
        bucket.addTasks(tasks)
    });
    await bucket.start().then(taskResults =>updateProdPricingOffers(taskResults));

    // console.log(JSON.stringify(res, null, 4));
}
