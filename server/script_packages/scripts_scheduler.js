const cron = require('node-cron');
const { pyProcessBB } = require('./py_process.js');

//cron scheduler run pyProcessBB get bb prices at 6 pm everyday
const scheduler_bb = cron.schedule("00 06 18 * * *", () => {
    console.log("Scheduler started: getting bb prices...")
    pyProcessBB()
    console.log('Scheduler bb job completed.')

}
);

module.exports = {
    schedulerBB: scheduler_bb
}