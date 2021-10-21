const cron = require('node-cron');
const { pyProcessBB } = require('./py_process.js');

//cron scheduler run pyProcessBB get bb prices at 6 pm everyday
const scheduler_bb = cron.schedule("00 14 10 * * *", () => {
    console.log("\n[Scheduler bb] starting to get bb prices...")
    pyProcessBB()
    console.log('[Scheduler bb] job completed.')

}
);

module.exports = {
    schedulerBB: scheduler_bb
}