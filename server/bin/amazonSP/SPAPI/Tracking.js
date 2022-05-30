import { sellingPartner } from "../RateLimiter.js";
const RATE_PER_SEC = 1;
const BURST = 1;

export default class Tracking {

    static limit = {
        ratePerSec: RATE_PER_SEC,
        burst: BURST
    };

    constructor() {
        this.param = {
            operation: "getTrackingInformation",
            endpoint: "shipping",
            path: {
                trackingId: "1Z575RW12996766775"
            }

            // operation: "getOrders",
            // endpoint: "orders",
            // query: {
            //     CreatedAfter: "2022-05-29T00:00:00-07:00",
            //     MarketplaceIds: ["ATVPDKIKX0DER"]
            // }

            // operation: "getPackingSlip",
            // endpoint: "vendorDirectFulfillmentShipping",
            // path: {
            //     purchaseOrderNumber: "111-5860917-2807429"
            // }

            // operation: "getScheduledPackage",
            // endpoint: "easyShip",
            // query: {
            //     amazonOrderId: "111-3746248-1970657",
            //     marketplaceId: "ATVPDKIKX0DER"
            // }

            // operation:"getOrderMetrics",
            // endpoint: "sales",
            // query: {
            //     marketplaceIds: ["ATVPDKIKX0DER"],
            //     interval:"2022-05-28T00:00:00-07:00--2022-05-30T00:00:00-07:00",
            //     granularity:"Day"
            // },
            // options:{
            //     version:'v1'
            // }
            // operation:"getAccount",
            // endpoint:"shipping",


        }
        this.sellingPartner = sellingPartner();
    }

    // @overload
    createAndAddTasksToBucket(bucket, trackingId) {
        bucket.addTask(() => this.#taskPromise(trackingId))
    }
    // @overload
    #taskPromise(trackingId) {
        return new Promise((resolve, reject) => {
            let param = { ...this.param };
            // param.path.trackingId = trackingId;

            this.sellingPartner.callAPI(param)
                .then(response => {
                    let taskResult = {
                        response,
                        limit: Tracking.limit
                    }
                    resolve(taskResult)
                })
                .catch(e => {
                    console.error(`***[ERR] TrackingInformation task - tracking:${trackingId}\nmsg:${e}\n\n`)
                    reject(e)
                })
        })
    }



}