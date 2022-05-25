import cron from 'node-cron';
import { updateProdPricingCatalogItems } from './SPAPI/SP.js';

// cron scheduler update Amazon sku
const startAmazonScheduler = () => {
    cron.schedule("*/20 * * * *", async () => {
        await updateProdPricingCatalogItems()
    });
}

export default startAmazonScheduler