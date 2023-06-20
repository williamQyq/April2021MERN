import cron from 'node-cron';

interface SchedulerParams {
    schedule: string,
    process: () => Promise<any>;
}
interface Scheduler extends SchedulerParams { };

class Scheduler {
    constructor({ schedule, process }: SchedulerParams) {
        this.schedule = schedule;
        this.process = process;
    }
    start(): void {
        cron.schedule(this.schedule, this.process);
    }
}
export default Scheduler;