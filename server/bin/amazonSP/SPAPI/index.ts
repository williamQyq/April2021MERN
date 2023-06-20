import moment from 'moment'
import ProdPricing from './ProdPricing';
import { AmazonSellingPartnerDataProcessor as DbDataProcessor } from 'lib/query/amazon.query';
import { AmzProdPricingDoc } from '#root/lib/models/Amazon.model';
import { LeakyBucket } from '../Bucket';

interface ProdPricingSkuOffer {
    ASIN: string,
    Product: {
        Offers: any[];
    }
}

export class SPAPI {
    bucket: LeakyBucket<unknown>;
    constructor() {
        this.bucket = new LeakyBucket;
    }
    /* 
    @desc: Product Pricing API: getPricing
    @param: prods:Array<AmzProdPricing>
    @return: Void
    */
    async updateProdPricingCatalogItems(): Promise<void> {
        const db = new DbDataProcessor();
        const bucket = new LeakyBucket();
        //get database product documents
        let prods: AmzProdPricingDoc[] = await db.findAllProdPricing();
        let pricingDataSets = await this.getSellingPartnerProdPricing(prods)
        //update database product pricing.
        await this.updateProdPricingOffers(pricingDataSets);
    }
    /* 
        @desc:  Retrieve AMZ ProdPricing for each task in bucket queue
        @param: prods: Array<ProductAsinsMapping>
    
    */
    async getSellingPartnerProdPricing(prods: AmzProdPricingDoc[]): Promise<unknown[]> {
        console.log('[Amazon SP] ProdPricing tasks created...\n\n')
        prods.forEach(prod => {
            const task = new ProdPricing(prod);
            this.bucket.addTask(task);
        })
        return await this.bucket.processTasks()   //return the task response retrieved from SP-Api endpoints
    }

    /* 
        @Todo: reform this function***
        @desc: For each SP ProdPricing API task response, update asin offers.
        @param: taskResult: Array<{upc:string,sellingPartnerResponse:Array<ProdPricingApiASINRes>}>
        @return: Promise.allSettled(validTaskResults)
    */
    async updateProdPricingOffers(taskResults: any[]) {
        const db = new DbDataProcessor();
        let validTaskResults = taskResults
            .filter(res => res.upc != undefined && res.sellingPartnerResponse != undefined)
            .reduce((mergedTasks, curTask) => {
                let { upc, sellingPartnerResponse } = curTask;

                //for each sku offer in response push updatePromise to merged Promises
                sellingPartnerResponse.forEach((skuOffer: ProdPricingSkuOffer) => {
                    let asin = skuOffer.ASIN;
                    let offers = skuOffer.Product.Offers;
                    if (upc === undefined || asin === undefined || offers === undefined) {
                        return;
                    }
                    //push executed update Promise to merged Promises
                    mergedTasks.push(db.updateProdPricingOffer(upc, asin, offers)
                        .then(res => {
                            if (res)
                                console.log(`[Amazon SP] UPC:${res.upc} updated #[${asin}]# asin succeed.`)
                        })
                        .catch(err => {
                            console.log(`\n***[ERR]: Save ProductPricing offer to database err.\n${err}\n`)
                            throw (err)
                        })
                    )
                })
                return mergedTasks
            }, [])

        return Promise.allSettled(validTaskResults)
            .then(results => {
                console.log(`[Amazon SP] task all finished - ${moment().format('MMMM Do YYYY, h:mm:ss a')}`)
                let failedTasks = results.filter(result => result.status == "rejected")
                if (failedTasks.length > 0)
                    console.error(failedTasks)
            })
    }

}
