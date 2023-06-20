import mongoose, { FilterQuery, UpdateQuery, QueryOptions } from "mongoose";
import PrimeCost from "#root/lib/models/PrimeCost";
import { IPrimeCostDoc } from "../models/interface";
import { IPrimeCost as IRoutePrimeCost, ISkuUploadFeedsType, listingItem, Upc } from "../routes/api/interface.d";

interface IOperationApi {
    getPrimeCostByUpc: (upc: Upc) => Promise<[Upc, number]>;
    saveProductPrimeCost: (prod: IRoutePrimeCost) => Promise<any>;
    updateProductPrimeCost: (prod: IRoutePrimeCost) => Promise<any>;
}
/**
 * @description lagacy version of OperationApi is in ./utitlities.js
 */
export class OperationApi implements IOperationApi {
    private _PrimeCost: mongoose.Model<IPrimeCostDoc>;

    constructor() {
        this._PrimeCost = PrimeCost;
    }

    async getPrimeCostByUpc(upc: Upc): Promise<[Upc, number]> {

        let doc = await this._PrimeCost.find({
            _id: {
                upc: upc
            }
        })
        if (doc.length <= 0) {
            throw new Error(`Failure upc: ${upc}`)
        }
        const upcPrimeCost = doc[0].price;
        return [upc, upcPrimeCost];
    }

    async saveProductPrimeCost(prod: IRoutePrimeCost) {
        const newPrimeCostDoc = new this._PrimeCost({
            _id: {
                upc: prod.upc,
            },
            name: prod.name,
            price: prod.price,
            category: prod.category
        });

        return newPrimeCostDoc.save();
    }

    async updateProductPrimeCost(prod: IRoutePrimeCost) {
        console.log('update prod: ', prod)
        const filter: FilterQuery<any> = {
            _id: {
                upc: prod.upc
            }
        };
        const update: UpdateQuery<any> = {
            name: prod.name,
            price: prod.price,
            category: prod.category
        }
        const options: QueryOptions = { upsert: true };

        await this._PrimeCost.findOneAndUpdate(filter, update, options);

    }

    /**@override */
    parseAndAccumulateAccsValue(unparsedAccs: string): void {
        console.log(`[Failed] subclass method parseAndAccumulateAccsValue not being called correctly.\n`, unparsedAccs);
    }


}

/**
 * @description parse input ram accs to value. e.g. "8GB" -> 8
 */
export class RamOperation extends OperationApi {
    override parseAndAccumulateAccsValue(unparsedAccs: string): number {
        const ramValueMatchReg = /(?<value>\d+)GB/;
        const found = unparsedAccs.match(ramValueMatchReg);
        if (!found)
            return 0;

        return Number(found.groups!.value!);
    }
}

/**
 * @description parse input accs to value. e.g. "PCIE1024" -> 1024
 * 
 */
export class SsdOperation extends OperationApi {
    override parseAndAccumulateAccsValue(unparsedAccs: string): number {
        const SsdValueMatchReg = /[A-Z]*(?<value>\d+)/;
        const found = unparsedAccs.match(SsdValueMatchReg);
        if (!found)
            return 0;

        return Number(found.groups!.value);
    }
}

export class OsOperation extends OperationApi {
    parseAccsValue(unparsedAccs: string): string {
        const osMatchReg = /(?<os>[A-Z])$/;
        const found = unparsedAccs.match(osMatchReg);

        if (!found)
            return "N";

        return found.groups!.os;
    }
}
export class HddOperaion extends OperationApi {
    parseAccsValue(unparsedAccs: string): number {
        if (!unparsedAccs || unparsedAccs === "None")
            return 0;

        const hddValueMatchReg = /(?<value>\d)TB/;
        const found = unparsedAccs.match(hddValueMatchReg);
        if (!found)
            return 0;

        return Number(found.groups!.value);
    }
}

export class Listings {
    #ssdOper: SsdOperation;
    #ramOper: RamOperation;
    #osOper: OsOperation;
    #hddOper: HddOperaion;
    listingItems: listingItem;
    constructor(newItems: listingItem) {
        this.#ssdOper = new SsdOperation();
        this.#ramOper = new RamOperation();
        this.#osOper = new OsOperation();
        this.#hddOper = new HddOperaion();

        this.listingItems = newItems;
    }

    createNewSku(): string {
        let accumRamValue = 0, accumSsdValue = 0;
        let parsedHdd, parsedOs;

        accumSsdValue = this.listingItems.ssd.reduce((accum: number, unparsedSsd: string) => {
            let ssdValue = this.#ssdOper.parseAndAccumulateAccsValue(unparsedSsd);
            return accum + ssdValue
        }, 0);

        accumRamValue = this.listingItems.ram.reduce((accum: number, unparsedRam: string) => {
            let ramValue = this.#ramOper.parseAndAccumulateAccsValue(unparsedRam);
            return accum + ramValue;
        }, 0);

        parsedHdd = this.#hddOper.parseAccsValue(this.listingItems.hdd);
        parsedOs = this.#osOper.parseAccsValue(this.listingItems.os);

        let paddedSsd = accumSsdValue.toString().padStart(4, '0');
        let paddedRam = accumRamValue.toString().padStart(2, '0');
        let paddedHdd = parsedHdd.toString().padEnd(2, '0');

        return `${this.listingItems.upc}-${paddedRam}${paddedSsd}${paddedHdd}${parsedOs}00P-AZM-${this.listingItems.asin}`
    }

    generatePrice(primeCost: number, profitRate: number): number {
        if (primeCost && profitRate >= 0)
            return Number((primeCost * (1 + profitRate / 100)).toFixed(0) + '.99');

        console.error(`[Failed] generatePrice failed.\n`, this.listingItems);
        return 1999; //something goes wrong, return default price $1999
    }

    putListingItem(primeCost: number, profitRate: number): Partial<ISkuUploadFeedsType> {
        let price = this.generatePrice(primeCost, profitRate);

        let minAllowedPrice = Number((price * 0.9).toFixed(0) + '.99');
        let maxAllowedPrice = Number((price * 2.0).toFixed(0) + '.99');

        let sku = this.createNewSku();

        return {
            "sku": sku,
            "product-id": this.listingItems.asin,
            "product-id-type": 1,
            "price": price,
            "minimum-seller-allowed-price": minAllowedPrice,
            "maximum-seller-allowed-price": maxAllowedPrice,
            "item-condition": 11,
            "quantity": 0,
            "add-delete": "a",
            "will-ship-internationally": undefined,
            "expedited-shipping": undefined,
            "standard-plus": undefined,
            "item-note": undefined,
            "fulfillment-center-id": "AMAZON_NA",
            "product-tax-code": undefined,
            "handling-time": undefined,
            "merchant_shipping_group_name": "USprime"
        };
    }

}