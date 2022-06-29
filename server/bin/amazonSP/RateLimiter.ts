import { performance } from 'perf_hooks';

type T = any;
type Time = number;
type Task = () => Promise<T>;
type RequestLimit = T;

interface LeakyBucket {
    readonly capacity: number,
    performance: Time,
    queue: Task[]
}

class LeakyBucket {
    static capacity = 100;
    _performance: Time = 0;
    constructor() {
        this.queue = [];

    }

    _enqueue(task: Task): void {
        this.queue.push(task);
    }

    _dequeue(): void {
        this.queue.shift();
    }

    _delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    async _measureTaskHandlingPerformanceAndResovle(tasks: Task[]) {
        for (const task of tasks) {
            let start = performance.now();
            let onPromiseDone = () => performance.now() - start;
            let taskResponse = await task();    //execute task,retrieve promise
            let timeCost = onPromiseDone();
            if (taskResponse.limit !== undefined) {
                await this._delayOnLimitReached(taskResponse.limit, timeCost)
            }

        }

    }

    async _delayOnLimitReached(limit: RequestLimit, cost: Time) {

    }
}

export const bucket = new LeakyBucket();