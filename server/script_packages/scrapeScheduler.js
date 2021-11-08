const cron = require('node-cron');
const { pyProcessBB } = require('./scraper.js');

//cron scheduler run pyProcessBB get bb prices at 6 pm everyday
const scrapeBBScheduler = cron.schedule("00 00 09 * * *", () => {
    randomDelayScraper();

});

const randomDelayScraper = () => {
    let count = 0;
    let interval = setInterval(() => {
        console.log(`${(count + 1)} minutes pass...`);
        count += 1;
    }, 60000);

    //run scraper in an hour, random time.
    setTimeout(() => {
        clearInterval(interval);
        console.log(`Delay timer finished.`)

        pyProcessBB();

    }, getRandomMins(60))
}
// get random mins less than max
const getRandomMins = (max) => {
    min = Math.floor(Math.random() * max);
    sec = min * 60000;
    console.log(`Random delay mins: ${min}`);
    return sec;
}

module.exports = {
    scrapeBBScheduler: scrapeBBScheduler
}