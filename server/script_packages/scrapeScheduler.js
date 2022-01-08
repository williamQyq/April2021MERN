const cron = require('node-cron');
const { bestbuyScraper, microsoftScraper } = require('./scraper.js');

//cron scheduler run pyProcessBB get bb prices at 6 pm everyday
const scrapeScheduler = cron.schedule("00 49 09 * * *", () => {
    scrapeStores();

});

//scrape Stores after random delay minutes
const scrapeStores = () => {

    let count = 0;
    let interval = setInterval(() => {
        console.log(`${(count + 1)} minutes pass...`);
        count += 1;
    }, 60000);

    //run scraper in an hour, random time.
    setTimeout(() => {
        clearInterval(interval);
        console.log(`Delay timer finished.`)

        // scrappers: bestbuy,microsoft
        Promise.allSettled([microsoftScraper(), bestbuyScraper()])
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