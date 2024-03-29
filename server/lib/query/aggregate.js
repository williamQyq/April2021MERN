// @get aggregate query
import moment from "moment";
export const status = {
    shipment: {
        SUBSTANTIATED: "substantiated",
        PICK_UP_CREATED: "pickUpCreated",
        READY: "ready",
        SHIPPED: "shipped",
        BACK_ORDER: "backOrder",
        EXCEPTION: "exception",
        UNVERIFIED: "unverified"
    }
}

export const LAST_PRICE = {
    $arrayElemAt: [
        "$price_timestamps.price", -1
    ]
}
export const PREV_PRICE = {
    $arrayElemAt: [
        "$price_timestamps.price", -2
    ]
}
export const PRICE_CAPTURE_DATE = {
    $arrayElemAt: [
        "$price_timestamps.date", -1
    ]
}
export const PRICE_DIFF = {
    $subtract: [LAST_PRICE, PREV_PRICE]
}

// @sort aggregate query
export const SORT_ON_CAPTURE_DATE = {
    $sort: {
        captureDate: -1
    }
}

//@project aggregate query
export const PROJ_ITEM = {
    $project: {
        key: "$_id",
        link: 1,
        name: 1,
        sku: 1,
        qty: 1,
        upc: "$item_spec.upc",
        currentPrice: LAST_PRICE,
        isCurrentPriceLower: {
            $lt: [LAST_PRICE, PREV_PRICE]
        },
        priceDiff: PRICE_DIFF,
        captureDate: PRICE_CAPTURE_DATE
    }
}

export const PROJ_ITEM_DETAIL = {
    $project: {
        link: 1,
        name: 1,
        sku: 1,
        qty: 1,
        upc: "$item_spec.upc",
        price_timestamps: 1,
        currentPrice: LAST_PRICE,
        priceDiff: PRICE_DIFF,
    }
}
export const LOOKUP_ITEM_SPEC = {
    $lookup: {
        from: "itemSpec",
        localField: "sku",
        foreignField: "sku",
        as: "item_spec"
    }
}

export const UNWIND_ITEM_SPEC_AND_PRESERVE_ORIGIN = {
    $unwind: {
        path: "$item_spec",
        preserveNullAndEmptyArrays: true
    }
}

export const GET_INVENTORY_RECEIVED_HALF_MONTH_AGO = [
    {
        $unwind: {
            path: '$rcIts'
        }
    }, {
        $project: {
            _id: 1,
            mdfTmEst: '$mdfTm',
            mdfStmp: 1,
            orgNm: 1,
            UPC: '$rcIts.UPC',
            trNo: 1,
            qty: '$rcIts.qn'
        }
    }, {
        $match: {
            mdfStmp: {
                '$gte': getPastDateInUnix(14)   //half month ago date in unix number
            }
        }
    }, {
        $sort: {
            mdfStmp: -1
        }
    }, {
        $project: {
            _id: 1,
            mdfTmEst: 1,
            orgNm: 1,
            UPC: 1,
            trNo: 1,
            qty: 1
        }
    }
]

export function getPastDateInUnix(dayBefore) {
    let d = new Date();
    let day = d.getDate();
    d.setDate(day - dayBefore);

    // if (d.getMonth() == m) d.setDate(0);

    d.setHours(0, 0, 0, 0);
    let resultDate = Number(moment(d).format('x'))
    return resultDate;

}
export function getTodayDate() {
    return getPastDateInUnix(0)
}

export const GET_NEED_TO_SHIP_ITEMS_SINCE_LAST_WEEK = (limit, skip) => [
    {
        '$project': {
            '_id': 0,
            'tracking': "$_id",
            'orderID': 1,
            'orgNm': 1,
            'rcIts': 1,
            'UserID': 1,
            'shipBy': 1,
            'crtTm': 1,
            'crtStmp': 1,
            'status': 1,
            'operStatus': { $ifNull: ["$operStatus", status.shipment.UNVERIFIED] }
            // 'crtTm': {
            //     '$dateToString': {
            //         // 'format': '%Y-%m-%d T %HH%MM%SS',
            //         'timezone': 'America/New_York',
            //         'date': {
            //             '$toDate': '$crtStmp'
            //         }
            //     }
            // }
        }
    }, {
        '$match': {
            'crtStmp': {
                '$gte': getPastDateInUnix(7)    //one week ago in unix number
            },
            'status': { "$ne": status.shipment.SHIPPED },
            'operStatus': { "$eq": status.shipment.UNVERIFIED }
        }
    }, {
        '$sort': {
            'crtStmp': 1
        }
    }, {
        '$skip': skip
    }, {
        '$limit': limit
    }
]

export const COUNT_NEED_TO_SHIP_ITEMS = [
    {
        '$project': {
            '_id': 0,
            'tracking': "$_id",
            'orderID': 1,
            'orgNm': 1,
            'rcIts': 1,
            'UserID': 1,
            'shipBy': 1,
            'crtTm': 1,
            'crtStmp': 1,
            'status': 1,
            'operStatus': { $ifNull: ["$operStatus", status.shipment.UNVERIFIED] }
            // 'crtTm': {
            //     '$dateToString': {
            //         // 'format': '%Y-%m-%d T %HH%MM%SS',
            //         'timezone': 'America/New_York',
            //         'date': {
            //             '$toDate': '$crtStmp'
            //         }
            //     }
            // }
        }
    }, {
        '$match': {
            'crtStmp': {
                '$gte': getPastDateInUnix(7)
            },
            'status': { "$ne": "shipped" },
            'operStatus': { "$eq": status.shipment.UNVERIFIED }
        }
    }, {
        '$count': "shipmentCount"
    }
]

export const COUNT_SHIPMENT_BY_TODAY = () =>
    [
        {
            '$facet': {
                'total': [
                    {
                        '$match': {
                            'orderID': {
                                '$exists': true
                            },
                            'mdfStmp': {
                                '$gte': getTodayDate()
                            }
                        }
                    }, {
                        '$count': 'total'
                    }
                ],
                'pending': [
                    {
                        '$match': {
                            'orderID': {
                                '$exists': true
                            },
                            'mdfStmp': {
                                '$gte': getTodayDate()
                            },
                            'status': { "$ne": "shipped" }
                        }
                    }, {
                        '$count': 'pending'
                    }
                ],
                'confirm': [
                    {
                        '$match': {
                            'orderID': {
                                '$exists': true
                            },
                            'mdfStmp': {
                                '$gte': getTodayDate()
                            },
                            'operStatus': {
                                '$eq': status.shipment.SUBSTANTIATED
                            }
                        }
                    }, {
                        '$count': 'confirm'
                    }
                ]
            }
        }, {
            '$project': {
                'total': {
                    '$arrayElemAt': [
                        '$total.total', 0
                    ]
                },
                'pending': {
                    '$arrayElemAt': [
                        '$pending.pending', 0
                    ]
                },
                'confirm': {
                    '$arrayElemAt': [
                        '$confirm.confirm', 0
                    ]
                }
            }
        }
    ]

/* 
@desc count created label, non created label
*/
export const COUNT_CREATED_PICKUP_LABEL = [
    {
        '$facet': {
            'pickUpPending': [
                {
                    '$match': {
                        'orderID': {
                            '$exists': true
                        },
                        'crtStmp': {
                            '$gte': getPastDateInUnix(7)
                        },
                        'operStatus': { '$exists': false }
                    }
                }, {
                    '$count': 'pickUpPending'
                }
            ],
            'pickUpCreated': [
                {
                    '$match': {
                        'orderID': {
                            '$exists': true
                        },
                        'crtStmp': {
                            '$gte': getPastDateInUnix(7)
                        },
                        "$or":
                            [
                                { 'operStatus': { '$eq': status.shipment.PICK_UP_CREATED } },
                                { 'operStatus': { '$eq': status.shipment.SUBSTANTIATED } }
                            ]
                    }
                }, {
                    '$count': 'pickUpCreated'
                }
            ]
        }
    }, {
        '$project': {
            'pickUpPending': {
                '$arrayElemAt': [
                    '$pickUpPending.pickUpPending', 0
                ]
            },
            'pickUpCreated': {
                '$arrayElemAt': [
                    '$pickUpCreated.pickUpCreated', 0
                ]
            }
        }
    }
]

/* 
    @desc get shipped docs for comfirmation to deduct locInv qty
 */
export const GET_UNVERIFIED_SHIPMENT = [
    {
        '$project': {
            '_id': 0,
            'tracking': "$_id",
            'orderID': 1,
            'orgNm': 1,
            'rcIts': 1,
            'UserID': 1,
            'shipBy': 1,
            'mdfTm': 1,
            'mdfStmp': 1,
            'status': 1,
            'operStatus': { $ifNull: ["$operStatus", status.shipment.UNVERIFIED] }
        }
    }, {
        '$match': {
            'mdfStmp': {
                '$gte': 1660622400000, //@Warning: 2022-08-16 00:00:00 since then, get all unsubstantiated shipment
                // '$lt': dateMax
            },
            'status': { '$eq': "shipped" },
            '$or': [
                { 'operStatus': { "$eq": status.shipment.UNVERIFIED } },
                { 'operStatus': { "$ne": status.shipment.SUBSTANTIATED } }
            ]
        }
    }, {
        '$sort': {
            'mdfStmp': 1
        }
    }
]

export const GET_LOCINV_UPC_QTY_SUM_EXCLUDE_WMS = (upc) => [
    {
        '$match': {
            '_id.UPC': upc,
            '_id.loc': { "$ne": "WMS" },
            'qty': { "$gt": 0 }
        }
    }, {
        '$group': {
            '_id': {
                'upc': '$_id.UPC'
            },
            'sum': {
                '$sum': '$qty'
            }
        }
    }
]

export const GET_UPC_LOCATION_QTY_EXCEPT_WMS = (upc) => [
    {
        '$match': {
            '_id.UPC': upc,
            '_id.loc': {
                '$ne': 'WMS'
            },
            'qty': {
                '$gt': 0
            }
        }
    }, {
        '$project': {
            '_id': 0,
            'upc': '$_id.UPC',
            'loc': '$_id.loc',
            'qty': '$qty'
        }
    }, {
        '$sort': {
            'qty': 1
        }
    }
]
export const GET_UPC_BACK_UP_LOCS_FOR_PICK_UP = (upc) => [
    {
        '$match': {
            '_id.UPC': upc,
            '_id.loc': {
                '$ne': 'WMS'
            },
            'qty': {
                '$gt': 0
            }
        }
    }, {
        '$limit': 3
    }, {
        '$sort': {
            'qty': 1
        }
    }, {
        '$addFields': {
            'qtyStr': {
                '$toString': '$qty'
            }
        }
    }, {
        '$group': {
            '_id': '$_id.UPC',
            'backUpLocs': {
                '$push': {
                    '$concat': [
                        '$_id.loc', '--', '$qtyStr'
                    ]
                }
            }
        }
    }
]

export const GET_LOCATION_QTY_BY_UPC_AND_LOC = (upc, loc) => [
    {
        '$match': {
            '_id.UPC': upc,
            '_id.loc': loc,
        }
    }, {
        '$project': {
            '_id': 0,
            'upc': '$_id.UPC',
            'loc': '$_id.loc',
            'qty': '$qty'
        }
    }
]

/* @attention case insensitive: $toLower */
export const GET_SHIPMENT_BY_COMPOUND_FILTER = (fields) => {
    let compoundFilter = [];
    let matchObj = {};
    compoundFilter = compoundFilter.concat(
        [
            {
                '$unwind': {
                    'path': '$rcIts',
                    'includeArrayIndex': 'rcIts_index'
                }
            }, {
                '$unwind': {
                    'path': '$UPCandSN',
                    'includeArrayIndex': 'UPCandSN_index'
                }
            }, {
                '$project': {
                    '_id': {
                        '$concat': ["$_id", "-", "$rcIts.UPC"]
                    },
                    'trackingID': '$_id',
                    'orderID': 1,
                    'orgNm': 1,
                    'upc': '$rcIts.UPC',
                    'qty': '$rcIts.qty',
                    'userID': 1,
                    'shipBy': 1,
                    'crtTm': 1,
                    'crtStmp': 1,
                    'mdfTm': 1,
                    'mdfStmp': 1,
                    'status': 1,
                    'UPCandSN': 1,
                    'sn': '$UPCandSN.SN',
                    'rcIts': 1,
                    'compare': {
                        '$cmp': [
                            '$rcIts_index', '$UPCandSN_index'
                        ]
                    }
                }
            }, {
                '$match': {
                    'compare': 0
                }
            }, {
                '$project': {
                    '_id': {
                        '$concat': ["$trackingID", "-", "$rcIts.UPC"]
                    },
                    'trackingID': 1,
                    'orderID': 1,
                    'orgNm': 1,
                    'upc': 1,
                    'qty': 1,
                    'userID': 1,
                    'shipBy': 1,
                    'crtTm': 1,
                    'crtStmp': 1,
                    'mdfTm': 1,
                    'mdfStmp': 1,
                    'status': 1,
                    'sn': 1,
                    'upcLower': { "$toLower": "$upc" },
                    'trackingIDLower': { "$toLower": "$trackingID" },
                    'orderIDLower': { "$toLower": "$orderID" },
                    'orgNmLower': { "$toLower": "$orgNm" },
                    'userIDLower': { "$toLower": "$userID" },
                    'shipByLower': { "$toLower": "$shipBy" },
                    'snLower': { "$toLower": "$sn" },
                }
            }
        ]
    );

    if (fields["OrderId"]) {
        matchObj["orderIDLower"] = new RegExp(`.*${fields["OrderId"]}.*`);
    }
    if (fields["trackingId"]) {
        matchObj["trackingIDLower"] = new RegExp(`.*${fields["trackingId"]}.*`);
    }
    if (fields["orgNm"]) {
        matchObj["orgNmLower"] = new RegExp(`.*${fields["orgNm"]}.*`);
    }
    if (fields["upc"]) {
        matchObj["upcLower"] = new RegExp(`.*${fields["upc"]}.*`);
    }
    if (fields["sn"]) {
        matchObj['snLower'] = new RegExp(`^${fields["sn"]}.*`);
    }

    if (fields["dateTime"]) {
        let startDateUnix = Number(moment(fields["dateTime"][0]).format('x'));
        let endDateUnix = Number(moment(fields["dateTime"][1]).format('x'));
        matchObj["mdfStmp"] = { '$gte': startDateUnix, '$lte': endDateUnix }
    }

    //narrow limit doc search created in 3 months if search range too board.
    if (!fields["OrderId"] && !fields["trackingId"] && !fields["upc"] && !fields["sn"] && !fields["dateTime"]) {
        let startDateUnix = getPastDateInUnix(90); //3 months ago in date unix
        let endDateUnix = getPastDateInUnix(0);
        matchObj["mdfStmp"] = { '$gte': startDateUnix, '$lte': endDateUnix }
    }

    if (Object.entries(matchObj).length > 0) {
        compoundFilter.push({ '$match': matchObj })
    }
    return compoundFilter;
}

/* @attention case insensitive: $toLower */
export const GET_INVENTORY_RECEIVED_BY_COMPOUND_FILTER = (fields) => {
    let compoundFilter = [];
    let matchObj = {};
    compoundFilter = compoundFilter.concat([
        {
            '$unwind': {
                'path': '$rcIts'
            }
        }, {
            '$project': {
                '_id': {
                    '$concat': ["$trNo", "-", "$rcIts.UPC"]
                },
                'trackingID': '$trNo',
                'orgNm': 1,
                'upc': '$rcIts.UPC',
                'qty': '$rcIts.qn',
                'userID': 1,
                'shipBy': 1,
                'crtTm': 1,
                'crtStmp': 1,
                'mdfTm': 1,
                'mdfStmp': 1,
                'status': 1,
                'usrID':1,
                'upcLower': { "$toLower": "$rcIts.UPC" },
                'trackingIDLower': { "$toLower": "$trNo" },
                'orgNmLower': { "$toLower": "$orgNm" },
                'userIDLower': { "$toLower": "$userID" },
                'shipByLower': { "$toLower": "$shipBy" }
            }
        }
    ]);

    if (fields["trackingId"]) {
        matchObj["trackingIDLower"] = new RegExp(`.*${fields["trackingId"]}.*`);
    }
    if (fields["orgNm"]) {
        matchObj["orgNmLower"] = new RegExp(`.*${fields["orgNm"]}.*`);
    }
    if (fields["upc"]) {
        matchObj["upcLower"] = new RegExp(`.*${fields["upc"]}.*`);
    }

    if (fields["dateTime"]) {
        let startDateUnix = Number(moment(fields["dateTime"][0]).format('x'));
        let endDateUnix = Number(moment(fields["dateTime"][1]).format('x'));
        matchObj["mdfStmp"] = { '$gte': startDateUnix, '$lte': endDateUnix }
    }

    //narrow limit doc search created in 3 months if search range too board.
    if (!fields["trackingId"] && !fields["upc"] && !fields["dateTime"]) {
        let startDateUnix = getPastDateInUnix(90); //3 months ago in date unix
        let endDateUnix = getPastDateInUnix(0);
        matchObj["mdfStmp"] = { '$gte': startDateUnix, '$lte': endDateUnix }
    }


    if (Object.entries(matchObj).length > 0) {
        compoundFilter.push({ '$match': matchObj })
    }
    return compoundFilter;
}

/* @attention case insensitive: $toLower */
export const GET_INVENTORY_LOCATION_BY_COMPOUND_FILTER = (fields) => {
    let compoundFilter = [];
    let matchObj = {};
    compoundFilter = compoundFilter.concat([
        {
            '$project': {
                '_id': {
                    '$concat': ["$_id.UPC", "-", "$_id.loc"]
                },
                'upc': '$_id.UPC',
                'loc': '$_id.loc',
                'qty': 1,
                'mdfTm': 1,
                'mdfStmp': 1,
                'locLower': { "$toLower": "$_id.loc" },
                'upcLower': { "$toLower": '$_id.UPC' }
            }
        }
    ]);

    if (fields["loc"]) {
        matchObj["locLower"] = new RegExp(`.*${fields["loc"]}.*`);
    }
    // if (fields["qty"]) {
    //     matchObj["qty"] = new RegExp(`.*${fields["qty"]}.*`);
    // }
    if (fields["upc"]) {
        matchObj["upcLower"] = new RegExp(`.*${fields["upc"]}.*`);
    }

    if (fields["dateTime"]) {
        let startDateUnix = Number(moment(fields["dateTime"][0]).format('x'));
        let endDateUnix = Number(moment(fields["dateTime"][1]).format('x'));
        matchObj["mdfStmp"] = { '$gte': startDateUnix, '$lte': endDateUnix }
    }

    if (Object.entries(matchObj).length > 0) {
        compoundFilter.push({ '$match': matchObj })
    }

    return compoundFilter;
}

/* @attention case insensitive: $toLower */
export const GET_SELLER_INVENTORY_BY_COMPOUND_FILTER = (fields) => {
    let compoundFilter = [];
    let matchObj = {};
    compoundFilter = compoundFilter.concat([
        {
            '$project': {
                '_id': {
                    '$concat': ["$_id.UPC", "-", "$_id.org"]
                },
                'upc': '$_id.UPC',
                'qty': 1,
                'org': '$_id.org',
                'mdfTm': 1,
                'mdfStmp': 1,
                'upcLower': { "$toLower": "$_id.UPC" },
                'orgLower': { "$toLower": "$_id.org" }
            }
        }
    ]);


    // if (fields["qty"]) {
    //     matchObj["qty"] = new RegExp(`.*${fields["qty"]}.*`);
    // }
    if (fields["upc"]) {
        matchObj["upcLower"] = new RegExp(`.*${fields["upc"]}.*`);
    }

    if (fields["dateTime"]) {
        let startDateUnix = Number(moment(fields["dateTime"][0]).format('x'));
        let endDateUnix = Number(moment(fields["dateTime"][1]).format('x'));
        matchObj["mdfStmp"] = { '$gte': startDateUnix, '$lte': endDateUnix }
    }

    // careful "0" in js
    if (fields["gt"] >= 0) {
        matchObj["qty"] = { "$gt": fields["gt"] };
    }

    if (Object.entries(matchObj).length > 0) {
        compoundFilter.push({ '$match': matchObj })
    }

    return compoundFilter;
}

export const GET_NEED_TO_SHIP_ITEMS_FOR_PICKUP_BY_TODAY = [
    {
        '$project': {
            '_id': 0,
            'tracking': "$_id",
            'orgNm': 1,
            'rcIts': 1,
            'crtTm': 1,
            'crtStmp': 1,
            'status': 1,
            'operStatus': { $ifNull: ["$operStatus", status.shipment.UNVERIFIED] }
        }
    }, {
        '$match': {
            'crtStmp': {
                '$gte': getPastDateInUnix(7)    //all non pick up created in one week
            },
            'status': {
                '$ne': 'shipped'
            },
            'operStatus': { "$eq": status.shipment.UNVERIFIED }
        }
    }, {
        '$sort': {
            'crtStmp': 1
        }
    }
]