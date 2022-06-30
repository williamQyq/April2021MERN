import { performance } from 'perf_hooks';

type T = any;
type Time = number;
type Task = () => Promise<T>;
type RequestLimit = {
    ratePerSec: number,
    burst?: number
};
type TaskResponse = T;

interface LeakyBucket {
    readonly capacity: number;
    performance: Time;
    queue: Task[];

    start(): Promise<Array<TaskResponse>>;
    isQueueEmpty(): boolean;

    _enqueue(task: Task): void;
    _dequeue(): void;
    _delay(ms: number): Promise<void>;
    _measureTaskHandlingPerformanceAndResovle(tasks: Task[]): Promise<Array<TaskResponse>>;
    _delayOnLimitReached(index: number, limit: RequestLimit, cost: Time): Promise<void>;
    _clearTimer(): void;

}

class LeakyBucket {
    static capacity = 100;
    _performance: Time = 0;
    constructor() {
        this.queue = [];

    }

    async start() {
        let isQueueEmpty = this.isQueueEmpty();
        if (isQueueEmpty) {
            return;
        }
        let tasks: Array<Task> = this.queue.map(task => task); //copy task queue.
        this._clearQueue();

        let results = await this._measureTaskHandlingPerformanceAndResovle(tasks);
        return results;
    }
    isQueueEmpty() {
        return this.queue.length > 0 ? false : true;
    }

    _enqueue(task: Task): void {
        this.queue.push(task);
    }

    _dequeue(): void {
        this.queue.shift();
    }
    _clearQueue(): void {
        this.queue = new Array();
    }

    async _delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    async _measureTaskHandlingPerformanceAndResovle(tasks: Task[]) {
        let results = new Array();

        for (const [index, task] of tasks.entries()) {
            let start = performance.now();
            let onPromiseDone = () => performance.now() - start;
            let taskResponse = await task();    //execute task,retrieve promise
            results.push(taskResponse);
            let timeCost = onPromiseDone();
            if (taskResponse.limit !== undefined) {
                await this._delayOnLimitReached(index, taskResponse.limit, timeCost)
            }

        }
        return results;
    }

    async _delayOnLimitReached(index: number, limit: RequestLimit, cost: Time) {
        this._performance += cost;
        let rpc = limit.ratePerSec;
        let isRpcReached = (index + 1) % rpc == 0 ? true : false;

        if (isRpcReached) {
            if (this._performance >= 1000) {
                console.log(`Req Rate Limit Reached, delay 1 sec...`)
                await this._delay(1000);
            }
            this._clearTimer();
        }
    }

    _clearTimer() {
        this._performance = 0;
    }
}

export const bucket = new LeakyBucket();