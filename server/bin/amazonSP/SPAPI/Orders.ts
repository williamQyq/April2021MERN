import moment from 'moment';
import { bucket } from '../RateLimiter.js';
import { sellingPartner } from '../Bucket';

type DeepReadOnly<T> = {
    readonly [P in keyof T]: DeepReadOnly<T[P]>;
};
interface GetOrdersQuery {
    MarketplaceIds: string[],
    LastUpdatedAfter?: string,
    LastUpdatedBefore?: string,
    CreatedAfter?: string,
    OrderStatuses?: string[],
}

export interface Orders {
    limit: DeepReadOnly<ReqLimit>;
    getOrdersParam: {
        operation: string,
        endpoint: string,
        query: GetOrdersQuery
    };
    sellingPartner: typeof sellingPartner;
    bucket: any;
}
interface ReqLimit {
    ratePerSec: number,
    burst: number
}

export class Orders {
    sellingPartner = sellingPartner;
    static limit = {
        ratePerSec: 0.0167,
        burst: 20
    }

    constructor() {
        this.getOrdersParam = {
            operation: "getOrders",
            endpoint: "orders",
            query: {
                MarketplaceIds: ["ATVPDKIKX0DER"],
                LastUpdatedAfter: "",
                LastUpdatedBefore: "",
                OrderStatuses: ["Unshipped", "Shipped"]
            }
        }
        this.bucket = bucket;
    }

    async getOrders() {
        this._createAndAddTasksToBucket();
        let ordersRes = await this.bucket.start();
        return ordersRes;
    }

    _createAndAddTasksToBucket() {
        this.bucket.addTask(() => this._createTaskPromise())
    }
    _createTaskPromise() {
        return new Promise((resolve, reject) => {
            let param = {
                ...this.getOrdersParam,
                query: {
                    ...this.getOrdersParam.query,
                    LastUpdatedAfter: moment("2022-07-21T00:00:00Z").toISOString(),
                    // LastUpdatedBefore: moment("2022-06-28T00:00:00Z").toISOString()
                }
            };
            // let param = this.getOrdersParam;
            this.sellingPartner.callAPI(param)
                .then(res => {
                    let taskResult = {
                        res,
                        limit: Orders.limit
                    }
                    resolve(taskResult)
                })
                .catch(err => {
                    console.error(`***[ERR] Orders task \n msg:${err}\n\n`)
                    reject(err);
                })
        })
    }
}