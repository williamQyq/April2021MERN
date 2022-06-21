import cron from 'node-cron';
import moment from 'moment';
import Microsoft from './helper/MS.js';
import Bestbuy from './helper/BB.js';

//cron scheduler starts everyday
const startScrapeScheduler = () => {
    cron.schedule("00 00 05 * * *", () => {
        scrapeStores();
    });
}

//scrape Stores after random delay minutes
const scrapeStores = () => {
    let msPPteer = new Microsoft();
    let bbPPteer = new Bestbuy();
    let rand = getRandomMiliSec(10000)
    let count = 0
    let interval = setInterval(() => {
        console.log(`[Script]count down in ***${Math.floor((rand / 1000) - count)}*** sec...`);
        count += 1
    }, 1000);

    //run scraper in an hour, random time.
    setTimeout(async () => {
        clearInterval(interval);
        console.log(`[Script] start`)

        // scrappers: bestbuy,microsoft
        await Promise.allSettled([msPPteer.getAndSaveMicrosoftLaptopsPrice(), bbPPteer.getAndSaveBestbuyLaptopsPrice()])
            .then(results => {
                results.forEach((result) => {
                    console.log(`Result:${result.status} - ${moment().format('MMMM Do YYYY, h:mm:ss a')}`)
                })
            })
    }, rand)
}

// get random mins less than max
const getRandomMiliSec = (milisec) => {
    return Math.floor(Math.random() * milisec);
}

export default startScrapeScheduler;