const cron = require('node-cron');
const { pyProcessBB } = require('./scraper.js');

//cron scheduler run pyProcessBB get bb prices at 6 pm everyday
const scrapeBBScheduler = cron.schedule("00 50 13 * * *", () => {
    console.log("\n[Scheduler bb] starting to get bb prices...")
    pyProcessBB()
    console.log('[Scheduler bb] job completed.')

});

module.exports = {
    scrapeBBScheduler: scrapeBBScheduler
}