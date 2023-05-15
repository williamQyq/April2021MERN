import moment from 'moment';
import * as mongoDB from 'mongodb';
import { IPickUp, IPickUpTask } from '#root/bin/pdfGenerator/pdfGenerator';
import wms from "lib/db/wms.db";
import {
    BackUpLocationDoc,
    IAwaitingShipment,
    IAwaitingShipmentMap,
    IPickUpCountDoc,
    IUpdateShipmentStatusErrorMessage,
    IUpdateShipmentStatusResponse,
    LocationDoc,
    PickUpItemsDoc
} from '#root/@types/interface';
// aggregate queries with typescript.
import {
    COUNT_CREATED_PICKUP_LABEL,
    GET_NEED_TO_SHIP_ITEMS_FOR_PICKUP_BY_TODAY,
    GET_UPC_BACK_UP_LOCS_FOR_PICK_UP,
    GET_UPC_LOCATION_QTY_EXCEPT_WMS
} from '#query/aggregate.query';
// plain js aggregate queries.
import {
    GET_INVENTORY_RECEIVED_HALF_MONTH_AGO,
    GET_NEED_TO_SHIP_ITEMS_SINCE_LAST_WEEK,
    COUNT_SHIPMENT_BY_TODAY,
    COUNT_NEED_TO_SHIP_ITEMS,
    GET_UNVERIFIED_SHIPMENT,
    GET_LOCINV_UPC_QTY_SUM_EXCLUDE_WMS,
    GET_LOCATION_QTY_BY_UPC_AND_LOC,
    GET_SHIPMENT_BY_COMPOUND_FILTER,
    GET_INVENTORY_RECEIVED_BY_COMPOUND_FILTER,
    GET_SELLER_INVENTORY_BY_COMPOUND_FILTER,
    GET_INVENTORY_LOCATION_BY_COMPOUND_FILTER
} from "./aggregate.js";
import getTempLoc from '#root/lib/query/locationTemp'; //bad practice pay attention.

interface IWmsCollection {
    [key: string]: string
}

enum Collection {
    Shipment = "shipment",
    SellerInv = "sellerInv",
    LocationInv = "locationInv"
}

/* 
    @desc: for shipment DB docs status
*/
export enum shipmentStatus {
    SHIPPED = "shipped",
    READY = "ready",
    SUBSTANTIATED = "substantiated",
    PICK_UP_CREATED = "pickUpCreated"
}

export class WmsDBApis {
    static readonly Collection = Collection;
    readonly Collection = WmsDBApis.Collection;

    private readonly db: mongoDB.Db | void;
    static _collection: IWmsCollection = {
        shipment: "shipment",
        sellerInv: "sellerInv",
        locationInv: "locationInv",
        inventoryReceive: "inventoryReceive"
    };

    constructor() {
        this.db = wms;
    }

    async createPickUpFromReadyShipment(forUpgradeTrackings: Set<string | undefined>): Promise<{ pickUpData: IPickUp, processedTrackings: Set<string> }> {
        //get all items that need picked up
        const pickUpDocs: PickUpItemsDoc[] = await this.getPickUpFromShipment(0, 0)

        //create Mapping: all need picked up upc map qty location

        const forUpgrade = this.createNeedShippingMapping(pickUpDocs, forUpgradeTrackings);
        const forOrig = this.createNeedShippingMapping(pickUpDocs, forUpgrade.unPorcessedTrackings)

        //seperate need upgrade upc tasks on needUpgradeTrackings
        const origTasks: IPickUpTask[] = await this.createPickUpTasks(forOrig.awaitingShipmentMapping);
        const upgradeTasks: IPickUpTask[] = await this.createPickUpTasks(forUpgrade.awaitingShipmentMapping);

        const processedTrackings = new Set([...forOrig.processedTrackings, ...forUpgrade.processedTrackings]);

        const processedTrackingsArr = Array.from(processedTrackings);
        console.log(`===Orig Map===: \n`, forOrig.awaitingShipmentMapping, `\n\n`);
        console.log(`===Upgrade Map===: \n`, forUpgrade.awaitingShipmentMapping, `\n\n`);

        console.log(`===special trackings===:`, forUpgradeTrackings, `\n\n`)

        console.log(`===origTasks===:\n`, origTasks, `\n\n`)
        console.log(`===upgradeTasks===:\n`, upgradeTasks, `\n\n`)
        //pickUpData for return
        let pickUpData: IPickUp = {
            origTasks,
            upgradeTasks,
            processedTrackings: processedTrackingsArr,
            date: moment().format()
        }

        return { pickUpData, processedTrackings };
    }

    async getPickUpFromShipment(limit: number, skip: number): Promise<PickUpItemsDoc[]> {
        const collection: mongoDB.Collection<PickUpItemsDoc> = this.db!.collection(WmsDBApis._collection.shipment);
        let pickUpDocs: PickUpItemsDoc[] = (await collection.aggregate(GET_NEED_TO_SHIP_ITEMS_FOR_PICKUP_BY_TODAY).toArray()) as PickUpItemsDoc[];

        return pickUpDocs;
    }

    createNeedShippingMapping(docs: PickUpItemsDoc[], awaitShipmentTrackings: Set<string | undefined>): IAwaitingShipment {
        // const needShippingAllMapping: IUnShipmentMap
        const awaitingShipmentMapping: IAwaitingShipmentMap = new Map();
        const processedTrackings = new Set<string>();
        const unPorcessedTrackings = new Set<string>();

        docs.forEach(awaitingShipmentDoc => {
            const { tracking, rcIts } = awaitingShipmentDoc;

            let isAwaitShipment = awaitShipmentTrackings.has(tracking);
            if (isAwaitShipment) {
                //create upc, await shipment qty Mapping
                rcIts.forEach(({ UPC, qty }) => {
                    let hasUpc: boolean = awaitingShipmentMapping.has(UPC);
                    if (hasUpc) {
                        let prevRcIts = awaitingShipmentMapping.get(UPC)!;
                        awaitingShipmentMapping.set(UPC, {
                            ...prevRcIts,
                            qty: prevRcIts.qty + qty,
                            trackings: [...prevRcIts.trackings, tracking]
                        })
                    } else {
                        awaitingShipmentMapping.set(UPC, {
                            qty,
                            trackings: [tracking],
                        })
                    }
                })
                processedTrackings.add(tracking);
            } else {
                unPorcessedTrackings.add(tracking);
            }

        })

        return { awaitingShipmentMapping, processedTrackings, unPorcessedTrackings }
    }

    async createPickUpTasks(awaitingShipmentMap: IAwaitingShipmentMap): Promise<IPickUpTask[]> {
        let pickUpTasks: IPickUpTask[];
        pickUpTasks = await Array.from(awaitingShipmentMap)
            .reduce<Promise<IPickUpTask[]>>(
                async (prevPromise, [upc, { qty }]) => {
                    let prev = await prevPromise;
                    let newTasks: IPickUpTask[] = await this.findPickUpLocationsByUpcAndQty(upc, qty);
                    return [...prev, ...newTasks]
                }, Promise.resolve([]))

        //sort pick up tasks on location
        const tempLocMap: Map<string, string> = getTempLoc();   //Extremely bad practice, but requested by the leader, bfs or dfs is suggested.
        const sortedPickUpTasks: IPickUpTask[] = pickUpTasks.sort((first: IPickUpTask, second: IPickUpTask) => {

            // const extractShelveRegex = /^(\d+).*$/
            // const naRegex = /not available/i
            // let firstLoc = first.location;
            // let secondLoc = second.location;
            // let firstShelvesMatch = extractShelveRegex.exec(firstLoc);
            // let secondShelvesMatch = extractShelveRegex.exec(secondLoc);

            // let firstShelves: number = firstShelvesMatch == null ? -1 : Number(firstShelvesMatch[1]);
            // let secondShelves: number = secondShelvesMatch == null ? -1 : Number(secondShelvesMatch[1]);

            // //could have better method...
            // if (firstShelvesMatch == null)
            //     firstShelves = naRegex.exec(firstLoc) == null ? firstShelves : -2

            // if (secondShelvesMatch == null)
            //     secondShelves = naRegex.exec(secondLoc) == null ? secondShelves : -2

            // return firstShelves - secondShelves;
            let firstLocValue = -1;
            if (tempLocMap.has(first.location)) {
                firstLocValue = Number(tempLocMap.get(first.location));
            }
            let secondLocValue = -1;
            if (tempLocMap.has(second.location)) {
                secondLocValue = Number(tempLocMap.get(second.location));
            }

            return firstLocValue - secondLocValue;

        })
        return sortedPickUpTasks;
    }

    async findPickUpLocationsByUpcAndQty(upc: string, qty: number): Promise<IPickUpTask[]> {
        let pickUpTasks: IPickUpTask[] = new Array()
        const collection: mongoDB.Collection = this.db!.collection(WmsDBApis._collection.locationInv);
        let upcLocQtyDocs: LocationDoc[] = await collection.aggregate(GET_UPC_LOCATION_QTY_EXCEPT_WMS(upc)).toArray() as LocationDoc[];
        let backUpLocsDoc: BackUpLocationDoc = (await collection.aggregate(GET_UPC_BACK_UP_LOCS_FOR_PICK_UP(upc)).toArray()).pop() as BackUpLocationDoc;

        let backUpLocs: Array<string | undefined>;
        if (backUpLocsDoc === undefined) {
            backUpLocs = [];
        } else {
            backUpLocs = backUpLocsDoc.backUpLocs;   //back up location for upc pick up
        }

        //upc location not exists in db
        if (upcLocQtyDocs.length === 0) {
            let NotAvailablePickUpTask: IPickUpTask[] = new Array({ upc, qty, location: "Not Available", backUpLocs: [] })
            return NotAvailablePickUpTask;
        }

        let unProcessedQty: number = qty;
        //iterate and process location qty
        for (const doc of upcLocQtyDocs) {
            const isQtyOnLocationEnough: boolean = doc.qty >= unProcessedQty ? true : false;
            if (isQtyOnLocationEnough) {
                pickUpTasks.push({ upc, qty: unProcessedQty, location: doc.loc, backUpLocs })
                return pickUpTasks;
            }
            //qty on location smaller than request qty, keep pushing to pickUptasks
            pickUpTasks.push({ upc, qty: doc.qty, location: doc.loc, backUpLocs });
            unProcessedQty -= doc.qty;
        }

        //all location qty not enough
        if (unProcessedQty > 0) {
            let wmsLocPickUpTask: IPickUpTask = { upc, location: "WMS", qty: unProcessedQty, backUpLocs: [] }
            pickUpTasks.push(wmsLocPickUpTask);
        }

        return pickUpTasks;

    }

    /* 
        @desc: update shipment docs: operStatus field to new status
    */
    async updateShipmentStatus(trackingID: string, newStatus: shipmentStatus) {
        let query = { _id: trackingID }
        let update = { $set: { "operStatus": newStatus } }

        try {
            const collection: mongoDB.Collection<any> = this.db!.collection(WmsDBApis.Collection.Shipment);
            const updateResult: mongoDB.UpdateResult = await collection.updateOne(query, update);
            let isUpdated: boolean = updateResult.modifiedCount === 1 ? true : false;
            const updateQueryResp: IUpdateShipmentStatusResponse = {
                action: "updateShipmentStatus",
                trackingID,
                newStatus,
                queryRes: isUpdated
            }

            return updateQueryResp;

        } catch (err) {
            let errMsg: IUpdateShipmentStatusErrorMessage = { action: "updateShipmentStatus", msg: `Shipment tracking: ${trackingID} rejected.`, rejectedTracking: trackingID };
            throw errMsg;
        }
    }

    async updateAllShipmentStatus(trackings: Set<string>, newStatus: shipmentStatus) {
        return Promise.allSettled(
            Array.from(trackings)
                .map(trackingID =>
                    new Promise((resolve, reject) => {
                        this.updateShipmentStatus(trackingID, newStatus)
                            .then(result => resolve(result))
                            .catch((err: IUpdateShipmentStatusErrorMessage) => {
                                let rejectResponse: IUpdateShipmentStatusErrorMessage = {
                                    action: err.action,
                                    msg: err.msg,
                                    rejectedTracking: err.rejectedTracking,
                                }
                                reject(rejectResponse)
                            })
                    })
                )
        )
    }

    /* 
        @warning: donot use for now
        @desc: currently invalid for use
    */
    async promiseAllSettledAction(iterableObj: Set<any> | Map<any, any>, actionCb: () => any) {
        return Promise.allSettled(
            Array.from(iterableObj)
                .map(element =>
                    new Promise((resolve, reject) => {
                        actionCb()
                            .then((result: any) => {
                                resolve(result)
                            })
                            .catch((err: Error) => {
                                reject(err.message)
                            })
                    })
                )
        )
    }

    async countNeedToShipPickUpFromShipment(): Promise<IPickUpCountDoc> {
        const collection = this.db!.collection(WmsDBApis.Collection.Shipment)
        let pickUpCountDoc = (await collection.aggregate(COUNT_CREATED_PICKUP_LABEL).toArray()).at(0) as IPickUpCountDoc;

        return pickUpCountDoc;
    }

    /**
     * @sellerInv
     * @param upc 
     * @param org 
     * @returns 
     */
    async findUpcQtyOnOrg(upc: string, org: string = "M") {
        const collection = this.db!.collection(WmsDBApis._collection.sellerInv);
        let qty = await collection.findOne({ '_id.UPC': upc, '_id.org': org })
            .then(doc => doc ? doc.qty : 0);

        return qty;
    }

    async findUpcQtyMultiOnOrg(upcs: string[], org = "M") {
        const collection = this.db!.collection(WmsDBApis._collection.sellerInv);
        let upcQtyArr = await collection.find({ '_id.UPC': { $in: upcs }, '_id.org': org }).toArray()
        return upcQtyArr;
    }

    //@desc: deprecat soon
    async getInventoryReceiveInHalfMonth() {
        const collection = this.db!.collection(WmsDBApis._collection.inventoryReceive);
        let invRecItemsHalfMonthAgo = await collection.aggregate(GET_INVENTORY_RECEIVED_HALF_MONTH_AGO).toArray();
        return invRecItemsHalfMonthAgo;
    }

    async getNeedToShipFromShipment(docLimits = 10, docSkip = 0) {
        const collection = this.db!.collection(WmsDBApis._collection.shipment);
        let needToShipItems = await collection.aggregate(GET_NEED_TO_SHIP_ITEMS_SINCE_LAST_WEEK(docLimits, docSkip)).toArray();
        return needToShipItems;
    }

    //Get all org pending shipment Info by default.
    async getShipmentCountByOrgNm(orgNm: string) {
        const collection = this.db!.collection(WmsDBApis._collection.shipment);
        let docs = await collection.aggregate(COUNT_SHIPMENT_BY_TODAY()).toArray();

        const shipmentCountByToday = docs[0];
        //handle no shipment document by today
        if (!shipmentCountByToday) {
            return ({ pending: 0, total: 0, confirm: 0 });
        }

        if (!shipmentCountByToday.pending)   //missing field if aggregate not match found
            return { ...shipmentCountByToday, pending: 0 }

        return shipmentCountByToday;
    }

    async countNeedToShipFromShipment() {
        const collection = this.db!.collection(WmsDBApis._collection.shipment);
        let docs = await collection.aggregate(COUNT_NEED_TO_SHIP_ITEMS).toArray();
        let count = docs.length > 0 ? docs[0].shipmentCount : 0
        return count;
    }

    async updateInventoryReceiveOrgNmOnTracking(tracking: string, newOrgNm: string) {
        const collection = this.db!.collection(WmsDBApis._collection.inventoryReceive);
        const trackingFilter: mongoDB.Filter<unknown> = { trNo: tracking };
        const orgNmUpdate = { $set: { orgNm: newOrgNm } };
        const options: mongoDB.FindOneAndUpdateOptions = { returnDocument: "after" };
        let updateOrgNmByTracking = await collection.findOneAndUpdate(trackingFilter, orgNmUpdate, options);
        return updateOrgNmByTracking;
    }

    //@desc: get shipped status and operStatus unverified shipment docs
    async getShippedNotVerifiedShipment(startDateUnix: number) {
        const collection = this.db!.collection(WmsDBApis._collection.shipment);
        let unverifiedShipment = await collection.aggregate(GET_UNVERIFIED_SHIPMENT).toArray();
        return unverifiedShipment;
    }

    async updateSellerInvQtyByUpcAndOrgNm(upc: string, orgNm: string, qty: number) {
        const query = {
            "_id.UPC": upc,
            "_id.org": orgNm,
            "qty": { $gte: qty }
        }
        const update = {
            $inc: { "qty": -qty }
        }

        const collection = this.db!.collection(WmsDBApis._collection.sellerInv);
        try {
            let sellerInvUpdatedResult = await collection.updateOne(query, update);
            return ({
                action: "updateSellerInvQtyByUpcAndOrgNm",
                orgNm,
                upc,
                needToShipQty: qty,
                queryRes: sellerInvUpdatedResult
            });
        } catch (err) {
            throw ({ reason: `SellerInv: ${upc} does not have enought qty.\n Need ${qty}` })
        }
        //@TEST 
        // throw ({ reason: `SellerInv: ${upc} does not have enought qty.\n Need ${qty}` })
    }

    /**
     * @desc:
     * 1. handle locQty on "WMS" only: no action needed.
     * 2. qty on location except "WMS" is not enough and "WMS" do not have enough qty: throw error.
     * 3. subtract shipped qty from every location sorting on qty until all qty shipped. *increment "WMS" loc shipped qty.
     */
    async updateLocationInvQtyByUpc(upc: string, reqProcQty: number) {
        let unProcQty = reqProcQty;
        const collection = this.db!.collection(WmsDBApis._collection.locationInv);
        let cursors = await collection.aggregate(GET_LOCINV_UPC_QTY_SUM_EXCLUDE_WMS(upc)).toArray();

        let hasQtyOnWMSOnly = cursors.length === 0 ? true : false;
        // do nothing, if no location qty sum documents exclude “WMS" are found. qty on WMS already being deducted.
        if (hasQtyOnWMSOnly) {
            return ({
                action: "updateLocationInvQtyByUpc",
                upc: upc,
                reqProcQty: reqProcQty,
                msg: "No location other than WMS exists, no action taken"
            });
        }

        let qtyOnLocExceptWMS = cursors[0].sum; //upc qty on location except WMS
        let locHasEnoughQty = qtyOnLocExceptWMS >= unProcQty ? true : false;

        let locWMSQty = (await collection.aggregate(GET_LOCATION_QTY_BY_UPC_AND_LOC(upc, "WMS")).toArray())[0].qty;

        //Whether WMS has enough qty after shipped qty on other location
        let locWMSHasEnoughQty = locWMSQty >= (reqProcQty - qtyOnLocExceptWMS) ? true : false;

        try {
            const upcLocQtyDocs = await collection.aggregate(GET_UPC_LOCATION_QTY_EXCEPT_WMS(upc)).toArray();
            //locations do not have enough qty for shippment and WMS location do not have enough qty after deducted needed qty
            if (!locHasEnoughQty && !locWMSHasEnoughQty) {
                throw new Error(`locInv: ${upc} does not have enought qty.\n Need ${unProcQty}`)
            }

            for (const doc of upcLocQtyDocs) {

                if (doc.qty < unProcQty) { //cur loc does not have enough qty for deduction
                    const findLocDocQuery = {
                        "_id.UPC": doc.upc,
                        "_id.loc": doc.loc
                    }
                    const update = {
                        $set: { "qty": 0 }
                    }
                    await collection.updateOne(findLocDocQuery, update)
                    unProcQty -= doc.qty;   //subtract qty from locInv
                } else if (doc.qty >= unProcQty) {
                    const findLocDocQuery = {
                        "_id.UPC": doc.upc,
                        "_id.loc": doc.loc
                    }
                    const update = {
                        $inc: { "qty": -unProcQty }
                    }
                    await collection.updateOne(findLocDocQuery, update)
                    unProcQty = 0
                    break;  //all qty processed, quit locqtyDocs iteration
                }
            }

            const findWMSDocQuery = {
                "_id.UPC": upc,
                "_id.loc": "WMS",
            }
            const update = {
                $inc: { "qty": reqProcQty }
            }
            await collection.updateOne(findWMSDocQuery, update)

            return ({
                action: "updateLocationInvQtyByUpc",
                upc,
                reqProcQty: reqProcQty,
                procQty: reqProcQty - unProcQty
            })
        } catch (err) {
            throw new Error(`locationInv: unable to get loc qty for upc ${upc}`)
        }
    }

    //@usage: router, method: POST, path: '/needToShip/confirmShipment'
    createUnShipmentMapping(unshippedOrders: any[]) {
        let unshippedOrderMap = new Map<string, { unShippedQty: number, trackings: string[] }>();
        let processedTrackings = new Set<string>();

        unshippedOrders.forEach((order) => {
            const { trackingID, rcIts } = order;
            rcIts.forEach(([unShippedUpc, unShippedQty]: [string, number]) => {
                unShippedQty = Number(unShippedQty);
                let hasUnShippedUpc = unshippedOrderMap.get(unShippedUpc) === undefined ? false : true
                if (hasUnShippedUpc) {
                    let prevRcIts = unshippedOrderMap.get(unShippedUpc);
                    unshippedOrderMap.set(
                        unShippedUpc, {
                        ...prevRcIts,
                        unShippedQty: prevRcIts!.unShippedQty + unShippedQty,
                        trackings: [...prevRcIts!.trackings, trackingID]
                    }
                    )
                } else {
                    unshippedOrderMap.set(
                        unShippedUpc, {
                        unShippedQty: unShippedQty,
                        trackings: [trackingID]
                    });
                }
            })
            processedTrackings.add(order.trackingID)
        })

        return { unshippedOrderMap, processedTrackings }
    }

    async findAndModifyShipment() {
        // let update = {
        //     $set: { "status": newStatus }
        // }
        let pipeline = [
            {
                '$project': {
                    'status': 1,
                    'orderID': 1,
                    'rcIts': 1,
                    'crtTm': 1,
                    'mdfTm': 1,
                    'UPCandSN': 1,
                    'ymd': {
                        '$dateToString': {
                            'format': '%Y-%m-%d',
                            'date': {
                                '$toDate': '$mdfTm'
                            }
                        }
                    }
                }
            }, {
                '$match': {
                    'status': {
                        '$ne': 'shipped'
                    },
                    'ymd': {
                        '$gte': '2022-08-08',
                        '$lt': '2022-08-15'
                    }
                }
            }, {
                '$sort': {
                    'ymd': -1
                }
            }
        ];

        const collection = this.db!.collection(WmsDBApis._collection.shipment);
        let docs = await collection.aggregate(pipeline).toArray();
        for (const doc of docs) {
            const query = {
                _id: doc._id
            }
            const update = {
                $set: {
                    status: "shipped"
                }
            }
            await collection.updateOne(query, update);
        }
    }

    async getShipment(fields: unknown) {
        // let requiredFields = Object.assign({}, fields);
        // delete requiredFields.type;
        const collection = this.db!.collection(WmsDBApis._collection.shipment);
        let shipmentRecordsByReqFields = await collection.aggregate(GET_SHIPMENT_BY_COMPOUND_FILTER(fields)).toArray();
        return shipmentRecordsByReqFields;
    }

    async getInventoryReceive(fields: unknown) {
        // let requiredFields = Object.assign({}, fields);
        // delete requiredFields.type;
        const collection = this.db!.collection(WmsDBApis._collection.inventoryReceive);
        let invRecRecords = await collection.aggregate(GET_INVENTORY_RECEIVED_BY_COMPOUND_FILTER(fields)).toArray();
        return invRecRecords;
    }

    async getLocation(fields: unknown) {
        // let requiredFields = Object.assign({}, fields);
        // delete requiredFields.type;
        const collection = this.db!.collection(WmsDBApis._collection.locationInv);
        let locationRecordsByReqFields = await collection.aggregate(GET_INVENTORY_LOCATION_BY_COMPOUND_FILTER(fields)).toArray();
        return locationRecordsByReqFields;
    }

    async getSellerInventory(fields: unknown) {
        // let requiredFields = Object.assign({}, fields);
        // delete requiredFields.type;
        const collection = this.db!.collection(WmsDBApis._collection.sellerInv);
        let sellerInvRecordsByReqFields = await collection.aggregate(GET_SELLER_INVENTORY_BY_COMPOUND_FILTER(fields)).toArray();
        return sellerInvRecordsByReqFields;
    }

}