import { ReqParams, Operation } from 'amazon-sp-api';
import { performance } from 'perf_hooks';
import { RateLimit, Task, sellingPartner } from '../Bucket';
import { AmzProdPricingDoc } from '#root/lib/models/Amazon.model';

type Upc = string;
type Asin = string;

export default class ProdPricing extends Task<any> {
    doc: AmzProdPricingDoc;
    static accumulatedExecutionTime: number = 0;
    public sellingPartner = sellingPartner;
    public getPricingParam: ReqParams<Operation> = {
        operation: "getPricing",
        // endpoint: "productPricing",
        query: {
            MarketplaceId: "ATVPDKIKX0DER",
            Asins: undefined,
            ItemType: "Asin"
        }
    };
    public limit: RateLimit = {
        ratePerSec: 10,
        asinsLimit: 20,
        type: "PROD_PRICING"
    };

    constructor(doc: AmzProdPricingDoc) {
        super();
        this.doc = doc;
    }

    async execute(): Promise<any> {
        // #Todo: execution of ProdPricing
    }

    getRateLimit(): RateLimit {
        return this.limit;
    }
    hasRateLimit(): boolean {
        return true;
    }

    async delayOnlimitReached(index: number, timeCost: number): Promise<any> {
        // #Todo: delay on Rate Limit reached
    }
    /* 
    @private
    @desc: create a mapping between upc and its asins.
    @param:
    @return: a Map of upc and asins 
    */
    createProdAsinsMapping(prod: AmzProdPricingDoc): Map<Upc, Asin[]> {
        let upcAsinsMap = new Map<Upc, Asin[]>();
        const { asinsLimit } = this.getRateLimit();
        let asins: Asin[] = prod.identifiers.map(identifier => identifier.asin);  //get all asins
        let asinsChunks = this.sliceAsinsOnLimit(asins, asinsLimit);  //divide asins to chuncks on asins number limit
        //add to Map for each asins chunk.
        asinsChunks.forEach(chunk => {
            upcAsinsMap.set(prod.upc, chunk);
        })

        return upcAsinsMap;
    }

    sliceAsinsOnLimit(asinsArray: string[], asinsLimit?: number): Asin[][] {
        let chuncks: Asin[][] = [];
        if (asinsLimit === 0 || asinsLimit === undefined)
            return [asinsArray];

        for (let i = 0; i < asinsLimit; i += asinsLimit) {
            chuncks.push(asinsArray.slice(i, i + asinsLimit));
        }
        return chuncks;
    }

    // create upc asins prodpricing task and push to bucket
    // createAndAddTasksToBucket(bucket: LeakyBucket<unknown>, prod: AmzProdPricingDoc) {
    //     let upcAsinsMap: Map<Upc, Asin[]> = this.createProdAsinsMapping(prod);
    //     for (const [upc, asins] of upcAsinsMap) {
    //         bucket.addTask(() => this.taskPromise(upc, asins))
    //     }

    // }


}