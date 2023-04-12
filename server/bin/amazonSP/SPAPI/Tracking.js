import { sellingPartner } from "../RateLimiter.js";
// import SellingPartner from 'amazon-sp-api';

// import { AMZ_CREDENTIALS, AMZ_REFRESH_TOKEN, REGION } from '#root/config.js';
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
                trackingId: "1Z14V36V4201373377"
            }
            // operation: "getOrderItems",
            // endpoint: "orders",
            // path: {
            //     orderId: "112-3035584-3554646",
            // }

            // operation: "getOrders",
            // endpoint: "orders",
            // query: {
            //     CreatedAfter: "2022-05-29T00:00:00-07:00",
            //     MarketplaceIds: ["ATVPDKIKX0DER"]
            // }
            // operation: "getOrder",
            // endpoint: "orders",
            // path: {
            //     orderId:"112-2180120-3002633"
            // },

            // operation:"getTracking",
            // endpoint:"shipping",
            // query:{
            //     trackingId:"1Z575RW11399084697",
            //     // carrierId:
            // },

            // operation: "getRates",
            // endpoint: "shipping",
            // body: {
            //     shipTo: {
            //         name: "customer2",
            //         addressLine1: "92 dracut st",
            //         stateOrRegion: "MA",
            //         city: "Lowell",
            //         countryCode: "01",
            //         postalCode: "01854"
            //     },
            //     shipFrom: {
            //         name: "rockystone",
            //         addressLine1: "#123 26 clinton dr",
            //         stateOrRegion: "NH",
            //         city: "Hollis",
            //         countryCode: "01",
            //         postalCode: "03049"
            //     },
            //     serviceTypes: ["Amazon Shipping Ground", "Amazon Shipping Standard", "Amazon Shipping Premium"],
            //     containerSpecifications: [
            //         {
            //             dimensions: {
            //                 length: 18,
            //                 width: 13,
            //                 height: 3,
            //                 unit: "IN"
            //             },
            //             weight: {
            //                 unit: "lb",
            //                 value: 6
            //             }
            //         }
            //     ]
            // },

            // operation: "getOrderRegulatedInfo",
            // endpoint: "orders",
            // path: {
            //     orderId: "111-2650958-0317831"
            // },

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
            // options: {
            //     version: 'v1'
            // }
            // operation:"getAccount",
            // endpoint:"shipping",
        }
        this.sellingPartner = sellingPartner();
    }

    async getTracking() {
        // console.log(this.param);
        let res = await this.sellingPartner.callAPI(this.param);
        console.log(`tracking: \n`, res);
    }
    // @overload
    createAndAddTasksToBucket(bucket, trackingId) {
        bucket.addTask(() => this.taskPromise(trackingId))
    }
    // @overload
    taskPromise(trackingId) {
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

let service = new Tracking();
// console.log(REGION)
try {
    await service.getTracking();
} catch (err) {
    console.error(`***err: \n`, err.details);
}
