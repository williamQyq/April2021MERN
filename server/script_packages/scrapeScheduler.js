const cron = require('node-cron');
const { pyProcessBB } = require('./scraper.js');

//cron scheduler run pyProcessBB get bb prices at 6 pm everyday
const scrapeBBScheduler = cron.schedule("00 00 10 * * *", () => {
    console.log("\n[Scheduler bb] starting to get bb prices...")
    
    setTimeout(() => {
        pyProcessBB()
    }, 5000)

    console.log('[Scheduler bb] job completed.')

});

const getRandom2DigitString = (max) => {
    let num = Math.floor(Math.random() * max);
    return (num).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })
}

module.exports = {
    scrapeBBScheduler: scrapeBBScheduler
}