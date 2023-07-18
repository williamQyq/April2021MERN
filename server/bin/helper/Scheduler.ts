import cron from 'node-cron';
import Bestbuy from '../bot/bestbuy.bot';

interface SchedulerParams {
    schedule?: string,
    process?: () => any;
}
interface Scheduler extends SchedulerParams { };

class Scheduler {
    constructor(params?: SchedulerParams) {
        this.schedule = params?.schedule;
        this.process = params?.process;
    }
    start(): void {
        if (this.schedule == undefined || this.process == undefined) {
            console.error("[Err] time schedule string or process task not set.");
            return;
        }
        cron.schedule(this.schedule, this.process);
    }

    scheduleBestbuyCrawler(scheduleTime: string): void {
        let bot = new Bestbuy();
        cron.schedule(scheduleTime, bot.getAndSaveLaptopsPrice)
    }
}
export default Scheduler;