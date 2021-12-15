const cron = require('node-cron');
const { ProdPricing } = require('./models/Amz')
//cron scheduler update Amazon sku
// const amazonScheduler = cron.schedule("00 19 10 * * *", () => {
//     productPricingCheck();

// });
const amazonScheduler = () => {
    productPricingCheck();

};
const productPricingCheck = () => {
    

}


module.exports = { amazonScheduler: amazonScheduler }