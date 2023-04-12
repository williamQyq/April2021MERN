import cron from 'node-cron';
import { performance } from 'perf_hooks';
import SellingPartnerAPI from 'amazon-sp-api';
import config from "config";


export const sellingPartner = () => new SellingPartnerAPI({
    region: config.get('aws.region'),
    credentials: {
        SELLING_PARTNER_APP_CLIENT_ID: process.env.AMZ_SELLING_PARTNER_APP_CLIENT_ID,
        SELLING_PARTNER_APP_CLIENT_SECRET: process.env.AMZ_SELLING_PARTNER_APP_CLIENT_SECRET,
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        AWS_SELLING_PARTNER_ROLE: process.env.AWS_SELLING_PARTNER_ROLE
    },
    refresh_token: process.env.AMZ_REFRESH_TOKEN
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
    _performance = 0;

    constructor() {
        this.queue = [];
    }
    /*
         *  @private
         *  @desc: push task to queue
         */
    _enqueue(task) {
        this.queue.push(task);
    }
    /*
     *  @private
     *  @return: first task in task queue
     */
    _dequeue() {
        return this.queue.shift();
    }

    _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /*
     * @Private
     * @desc: update promise resolve time cost 
     * @param: task: ()=>Promise<{upc:string, sellingPartnerResponse:SpResponse, limit: APILimit}>
     * @return: result: TaskResult
     */
    async _measureAndResolvePromise(index, task) {
        let onPromiseDone = () => performance.now() - start;
        let start = performance.now();
        let taskResponse = await task();
        let timeCost = onPromiseDone();
        const { limit } = taskResponse;
        await this.delayIfReachedLimit(index, limit, timeCost)
        return taskResponse;
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
        this._enqueue(task);
    }

    getQueueLength() {
        return this.queue.length;
    }

    clearTimer() {
        this._performance = 0;
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
            try {
                for (let i = 0; i < queueLength; i++) {
                    let task = this._dequeue()
                    let result = await this._measureAndResolvePromise(i, task)
                    if (result === undefined) {
                        console.log(``)
                        continue;
                    }
                    results.push(result)
                }
            } catch (e) {
                console.error('bucket error:\n', e)
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
        this._performance += timeCost;
        let ratePerSec = limit.ratePerSec;
        let reqRateIsReached = (index + 1) % ratePerSec == 0 ? true : false;

        if (reqRateIsReached) {
            if (this._performance >= 1000) {
                console.log(`Req Rate Limit Reached, delay 1 sec...`)
                await this._delay(1000);
            }
            this.clearTimer();
        }
    }

}

export const bucket = new LeakyBucket();