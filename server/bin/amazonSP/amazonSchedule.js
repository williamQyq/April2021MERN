import cron from 'node-cron';
import moment from 'moment';
import { bucket } from './RateLimiter.js'
import { updateProdPricingCatalogItems } from './SPAPI/SP.js';
// cron scheduler update Amazon sku
export const amazonScheduler = cron.schedule("*/5 * * * *", async () => {
    await updateProdPricingCatalogItems()

});
// export const amazonScheduler = async () => {
//     await findAllProdPricing()
//         .then(prods => getSellingPartnerProdPricing(prods));

// };



