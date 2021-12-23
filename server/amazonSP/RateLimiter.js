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
    static ratePerSec = 10;
    static asinsLimit = 20;
    #taskCount = 0;

    constructor() {
        this.queue = [];
        this.reqCount = 0;
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
        let chuncks = this.#sliceAsinsOnLimit(asins, LeakyBucket.asinsLimit);

        chuncks.map(asinsChunck => {
            let task = this.#createTask(asinsChunck)
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
        const promisesArray = this.queue.map((task, index) => {
            
            return task
        })
        Promise.all(promisesArray).then(result => {
            console.log(JSON5.stringify(result, null, 4));
        })
    }
    getProdAsins(prod) {
        return prod.identifiers.map(identifier => (identifier.asin))
    }

    isTaskQueueEmpty() {
        return this.queue.length > 0 ? false : true;
    }

    #measurePromise(promisefun) {
        let onPromiseDone = () => performance.now() - start;

        let start = performance.now();
        return promisefun().then(onPromiseDone, onPromiseDone);
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

    #increaseTaskCount(amount) {
        this.#taskCount += amount;
    }

}

module.exports = {
    SpBucket: LeakyBucket,
    amazonSellingPartner: amazonSellingPartner
}
