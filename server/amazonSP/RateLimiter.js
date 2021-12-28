const cron = require('node-cron');
const config = require('config');
const { performance } = require('perf_hooks');
const JSON5 = require('json5');

const amazonSellingPartner = async () => {
    const CREDENTIALS = config.get('amazonCredentials');
    const IAM = config.get('amazonIAMRole');
    const SellingPartnerAPI = require('amazon-sp-api');

    return new SellingPartnerAPI({
        region: "na",
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

    //start
    throttle = () => {
        cron.schedule("* * * * *", () => {
            if (!this.isTaskQueueEmpty()) {
                this.doTaskQueue();
            }
        })
    }

    addProdPricingTasks(asins) {
        let chuncks = this.#sliceAsinsOnLimit(asins, this.#asinsLimit);
        chuncks.map(asinsChunck => {
            let task = this.#createTask(asinsChunck)    //task promise created, return immediately
            this.#enqueue(task);
        })
    }

    async doProdPricingTask(resolve, reject, asins) {
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

            resolve(res);

        } catch (e) {
            console.error(`AWS SP API ERROR:\n${e}`)
            reject(`AWS SP API ERROR:\n${e}`)
        }
    }

    doTaskQueue() {
        console.log(`queue length`, this.queue.length)
        const promisesArray = this.queue.map(async (task, index) => {
            await this.delayIfReachedLimit(index)
            let duration = await this.#measurePromise(task);
            console.log(`task queue current`, this.queue.length)

            this.#performance += duration;

            console.log(`Task:${index}; current Performance: ${this.#performance}; duration: ${duration}`)
            return this.#dequeue();
        })

        return Promise.all(promisesArray)
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
        return prod.identifiers.map(identifier => (identifier.asin))
    }

    isTaskQueueEmpty() {
        return this.queue.length > 0 ? false : true;
    }

    /*
     *  @private
     *  @create task for a chunck of asins
     */
    #createTask(asins) {
        return new Promise((resolve, reject) => {
            this.doProdPricingTask(resolve, reject, asins);
        })
    }
    /*
     *  @private
     *  @slice asins into task chuncks on API request limit
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
     *  @push task to queue
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
    #measurePromise(prom) {
        let onPromiseDone = () => performance.now() - start;
        let start = performance.now();
        return prom.then(onPromiseDone);
    }
}

module.exports = {
    SpBucket: LeakyBucket,
    amazonSellingPartner: amazonSellingPartner
}
