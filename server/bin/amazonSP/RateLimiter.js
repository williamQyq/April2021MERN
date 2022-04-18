import cron from 'node-cron';
import { performance } from 'perf_hooks';
import SellingPartnerAPI from 'amazon-sp-api';
import { AMZ_CREDENTIALS, AMZ_REFRESH_TOKEN, REGION } from '#root/config.js';

export const sellingPartner = new SellingPartnerAPI({
    region: REGION,
    credentials: AMZ_CREDENTIALS,
    refresh_token: AMZ_REFRESH_TOKEN
});

/* 
    interface TaskResult{
        upc:string;
        sellingPartnerResponse: SpResponse,
        limit: TaskLimit
    }
*/


class LeakyBucket {
    static capacity = 100;
    #performance = 0;

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
        return this.queue.shift();
    }

    #delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /*
     * @Private
     * @desc: update promise resolve time cost 
     * @param: task: ()=>Promise<{upc:string, sellingPartnerResponse:SpResponse, limit: APILimit}>
     * @return: result: TaskResult
     */
    async #measureAndResolvePromise(index, task) {
        let onPromiseDone = () => performance.now() - start;
        let start = performance.now();
        return task().then(async (result) => {
            let timeCost = onPromiseDone();
            const { limit } = result
            await this.delayIfReachedLimit(index, limit, timeCost)
            return result
        });
    }

    //start
    throttle = (minInterval) => {
        cron.schedule(`*/${minInterval} * * * *`, () => {
            if (!this.isTaskQueueEmpty()) {
                this.doTaskQueue();
            }
        }).start()
    }
    /*
     * @Public
     * @desc: task enqueue
     * @param: task: Promise<{upc:string, offers:AmzProdPricing, limit: APILimit}>
     */
    addTask(task) {
        this.#enqueue(task);
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
        let results = new Array();
        let isQueueEmpty = this.isQueueEmpty()
        let queueLength = this.getQueueLength();
        if (!isQueueEmpty) {
            for (let i = 0; i < queueLength; i++) {
                let task = this.#dequeue()
                let result = await this.#measureAndResolvePromise(i, task)
                if (result === undefined) {
                    console.log(``)
                    continue;
                }
                results.push(result)
            }
        }

        return results;
    }

    /* 
    @param: limit:<{
        ratePerSec: number,
        asinsLimit: number,
        type: <PRODUCT_PRICING|...>
    }>
    */
    async delayIfReachedLimit(index, limit, timeCost) {
        this.#performance += timeCost;
        let ratePerSec = limit.ratePerSec;
        let reqRateIsReached = (index + 1) % ratePerSec == 0 ? true : false;

        if (reqRateIsReached) {
            if (this.#performance >= 1000) {
                console.log(`Req Rate Limit Reached, delay 1 sec...`)
                await this.#delay(1000);
            }
            this.#clearTimer();
        }
    }

}

export const bucket = new LeakyBucket();