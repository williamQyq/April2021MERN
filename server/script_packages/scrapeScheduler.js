const cron = require('node-cron');
const { getBestbuyLaptops, getMicrosoftLaptops } = require('./scraper.js');

//cron scheduler run pyProcessBB get bb prices at 6 pm everyday
const scrapeScheduler = cron.schedule("00 20 09 * * *", () => {
    scrapeStores();

});

//scrape Stores after random delay minutes
const scrapeStores = () => {

    let cd = 10;
    let interval = setInterval(() => {
        console.log(`Script will start in ${cd} sec...`);
        cd--;
    }, 10000);

    //run scraper in an hour, random time.
    setTimeout(() => {
        clearInterval(interval);
        console.log(`Delay timer finished.`)

        // scrappers: bestbuy,microsoft
        Promise.allSettled([getMicrosoftLaptops(), getBestbuyLaptops()])
            .then(results => {
                results.forEach((result) => {
                    if (result.status == 'fulfilled')
                        console.log(`Result:${result.status},    ${result.value}`)
                    else
                        console.log(`Result:${result.status},    ${result.reason}`)
                })
            })
    }, getRandomMins(2))
}

// get random mins less than max
const getRandomMins = (max) => {
    min = Math.floor(Math.random() * max);
    sec = min * 60000;
    console.log(`Random delay mins: ${min}`);
    return sec;
}

module.exports = {
    scrapeScheduler: scrapeScheduler
}