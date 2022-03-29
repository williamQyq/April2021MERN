import cron from 'node-cron';
import config from 'config';
import { performance } from 'perf_hooks';

import SellingPartnerAPI from 'amazon-sp-api';

export const amazonSellingPartner = () => {
    const CREDENTIALS = config.get('AMZ_CREDENTIALS');
    const IAM = config.get('AMZ_IAM');
    const REGION = config.get('REGION')

    return new SellingPartnerAPI({
        region: REGION,
        credentials: CREDENTIALS,
        refresh_token: IAM.REFRESH_TOKEN

    });

}

class LeakyBucket {
    static capacity = 100;
    #performance = 0;
    #ratePerSec = 10;
    #asinsLimit = 20;

    constructor() {
        this.queue = [];
    }
    /*
         *  @private
         *  @desc: push task to queue
         */
    #enqueue(task) {
        this.queue.push(task);
    }
    /*
     *  @private
     *  @return: first task in task queue
     */
    #dequeue() {
        return this.queue.pop();
    }

    #delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /*
     * @Private
     * @desc: update promise resolve time cost 
     * @param: task: Promise<{upc:string, offers:AmzProdPricing, limit: APILimit}>
     * @return: result:<{timeCost:number, {upc:string, offers: AmzProdPricing, limit}} ||
     * {timeCost:number,undefined}>
     */
    #measureAndResolvePromise(prom) {
        let onPromiseDone = () => performance.now() - start;
        let start = performance.now();
        return prom.then(result => {
            return { timeCost: onPromiseDone, result }
        });
    }

    //start
    throttle = (minInterval) => {
        cron.schedule(`${minInterval} * * * *`, () => {
            if (!this.isTaskQueueEmpty()) {
                this.doTaskQueue();
            }
        })
    }
    /*
     * @Public
     * @desc: task enqueue
     * @param: task: Promise<{upc:string, offers:AmzProdPricing, limit: APILimit}>
     */
    addTasks(tasks) {
        tasks.forEach(task => {
            this.#enqueue(task);
        })
    }

    getQueueLength() {
        return this.queue.length;
    }

    #clearTimer() {
        this.#performance = 0;
    }
    /*
     *  @public
     *  @type boolean
     */
    isQueueEmpty() {
        return this.queue.length > 0 ? false : true;
    }

    async start() {
        let results = [];
        let isQueueEmpty = this.isQueueEmpty()
        let queueLength = this.getQueueLength();
        if (!isQueueEmpty) {
            for (let i = 0; i < queueLength; i++) {
                let task = this.#dequeue()
                let { result, timeCost } = await this.#measureAndResolvePromise(task)
                this.performance += timeCost;
                if (result === undefined) {
                    continue;
                }
                results.push(result)
                // await this.delayIfReachedLimit(i, spResult)
            }
        }

        return results;
    }


    async delayIfReachedLimit(index, task) {
        let ratePerSec = task.limit.ratePerSec;
        let reqRateIsReached = (index + 1) % ratePerSec == 0 ? true : false;

        if (reqRateIsReached && this.#performance >= 1000) {
            console.log(`Req Rate Limit Reached, delay 1 sec`)
            await this.#delay(1000);
        }

        this.#clearTimer();
    }

}

export const bucket = new LeakyBucket();
