import cron from 'node-cron';
import config from 'config';
import { performance } from 'perf_hooks';

import SellingPartnerAPI from 'amazon-sp-api';

export const amazonSellingPartner = async () => {
    const CREDENTIALS = config.get('amazonCredentials');
    const IAM = config.get('amazonIAMRole');


    return new SellingPartnerAPI({
        region: "na",
        credentials: CREDENTIALS,
        refresh_token: IAM.REFRESH_TOKEN

    });

}
const PRODUCT_PRICING = "productPricing";


// class TaskNode{
//     constructor(task){
//         this.type = task.type;

//         this.next = null;
//         this.prev = null;
//     }
// }

class LeakyBucket {
    static capacity = 100;
    #performance = 0;
    #ratePerSec = 10;
    #asinsLimit = 20;

    constructor() {
        this.queue = [];
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
     *  @Public
     *  @desc: task enqueue
     */
    addTask(task) {
        this.#enqueue(task);
    }

    addProdPricingTask(mapping) {
        let chuncks = this.#sliceAsinsOnLimit(mapping.asins, this.#asinsLimit); //each chunck contains an limited number of asins
        chuncks.forEach(asinsChunck => {
            let task = this.#createTask(mapping.upc, asinsChunck)    //task promise created, return immediately
            this.#enqueue(task);
        })
    }

    async initProdPricingTask(resolve, reject, upc, asins) {
        const SP = await amazonSellingPartner();

        try {
            let res = await SP.callAPI({
                operation: 'getPricing',
                endpoint: 'productPricing',
                query: {
                    MarketplaceId: 'ATVPDKIKX0DER',
                    Asins: asins,
                    ItemType: 'Asin'
                },
            })
            resolve({ upc, prom: res });

        } catch (e) {
            console.error(`AWS SP API ERROR:\n${e}`)
            reject(`AWS SP API ERROR:\n${e}`)
        }
    }

    doTaskQueue() {

        const promisesArray = this.queue.map((task, index) =>
            this.#dequeue(task, index)
        )

        return Promise.allSettled(promisesArray)
    }

    async delayIfReachedLimit(index) {
        if ((index + 1) % this.#ratePerSec == 0) {
            this.#performance < 1000 ? async () => {
                console.log(`Req Rate Limit Reached, delay 1 sec`)
                await this.#delay(1000);
            } : () => { }
            this.#performance = 0;
        }
    }

    getProdAsins(prod) {
        let asins = prod.identifiers.map(identifier => (identifier.asin))
        let upc = prod.upc;
        return { upc, asins }
    }

    /*
     *  @public
     *  @type boolean
     */
    isTaskQueueEmpty() {
        return this.queue.length > 0 ? false : true;
    }

    /*
     *  @private
     *  @desc: create task for a chunck of asins
     */
    #createTask(upc, asins) {
        return new Promise((resolve, reject) => {
            this.initProdPricingTask(resolve, reject, upc, asins);
        })
    }
    /*
     *  @private
     *  @desc: slice asins into task chuncks on API request limit
     */
    #sliceAsinsOnLimit(asins, limit) {
        let chuncks = [], i;
        for (i = 0; i < limit; i += limit) {
            chuncks.push(asins.slice(i, i + limit));
        }
        return chuncks;
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
    #dequeue(task, index) {
        // await this.delayIfReachedLimit(index)

        // let duration = await this.#measurePromise(task);
        // this.#performance += duration;

        // console.log(`Task:${index}; current Performance: ${this.#performance}; duration: ${duration}`)
        return this.queue.pop();
    }

    #delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    #measurePromise(prom) {
        let onPromiseDone = () => performance.now() - start;
        let start = performance.now();
        return prom.then(onPromiseDone);
    }
}

export const bucket = new LeakyBucket();
