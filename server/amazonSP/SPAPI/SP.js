import ProdPricing from './ProdPricing.js';
import { bucket } from '../RateLimiter.js';

/* 
@desc: Product Pricing API: getPricing
@param: prods:Array<AmzProdPricing>
@return:
*/
export const getCatalogItems = (prods) => {
    let res;
    let sp = new ProdPricing();

    //create tasks for each prod
    prods.forEach(prod => {
        let tasks = sp.createTasks(prod);
        tasks.forEach(task => bucket.addTask(task))
    });
    res = bucket.doTaskQueue();

    // console.log(JSON.stringify(res, null, 4));
    return res;
}
