import moment from 'moment';
import { MySellingPartnerAPI, bucket } from 'bin/amazonSP/RateLimiter';
export class Orders {
    static limit = {
        ratePerSec: 0.0167,
        burst: 20
    };
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
        };
        this.sellingPartner = MySellingPartnerAPI();
        this.bucket = bucket;
    }
    async getOrders() {
        this._createAndAddTasksToBucket();
        let ordersRes = await this.bucket.start();
        return ordersRes;
    }
    _createAndAddTasksToBucket() {
        this.bucket.addTask(() => this._createTaskPromise());
    }
    _createTaskPromise() {
        return new Promise((resolve, reject) => {
            let param = {
                ...this.getOrdersParam,
                query: {
                    ...this.getOrdersParam.query,
                    LastUpdatedAfter: moment("2022-06-28T00:00:00Z").toISOString(),
                    LastUpdatedBefore: moment("2022-06-28T00:00:00Z").toISOString()
                }
            };
            // let param = this.getOrdersParam;
            this.sellingPartner.callAPI(param)
                .then(res => {
                let taskResult = {
                    res,
                    limit: Orders.limit
                };
                resolve(taskResult);
            })
                .catch(err => {
                console.error(`***[ERR] Orders task \n msg:${err}\n\n`);
                reject(err);
            });
        });
    }
}
