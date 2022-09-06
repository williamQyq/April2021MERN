// @get aggregate query
import moment from "moment";
export const status = {
    shipment: {
        SUBSTANTIATED: "substantiated",
        READY: "ready",
        SHIPPED: "shipped",
        BACK_ORDER: "backOrder",
        EXCEPTION: "exception"
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
            _id: 0,
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
            _id: { $concat: ["$trNo", "-", "$UPC"] },
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

export const GET_NEED_TO_SHIP_ITEMS_BY_TODAY = (limit, skip) => [
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
                '$gte': getTodayDate()
            },
            'status': { "$ne": "shipped" }
        }
    }, {
        '$sort': {
            'crtStmp': 1
        }
    }, {
        '$skip': skip
    }, {
        '$limit': limit
    },

]

export const COUNT_NEED_TO_SHIP_ITEMS_BY_TODAY = [
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
            'status': 1
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
                '$gte': getTodayDate()
            },
            'status': { "$ne": "shipped" }
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
                                '$eq': 'substantiated'
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
//@params dateMax, dateMin: Unix date
export const GET_UNVERIFIED_SHIPMENT = (startDateUnix) => [
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
            'operStatus': { $ifNull: ["$operStatus", "unverified"] }
        }
    }, {
        '$match': {
            'mdfStmp': {
                '$gte': startDateUnix,
                // '$lt': dateMax
            },
            'status': { '$eq': "shipped" },
            'operStatus': { "$eq": "unverified" }
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
                    '_id': 0,
                    'trackingID': '$_id',
                    'orderID': 1,
                    'orgNm': 1,
                    'upc': '$rcIts.UPC',
                    'qty': '$rcIts.qty',
                    'userID': 1,
                    'shipBy': 1,
                    'crtTm': 1,
                    'mdfTm': 1,
                    'status': 1,
                    'UPCandSN': 1,
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
                    'trackingID': 1,
                    'orderID': 1,
                    'orgNm': 1,
                    'upc': '$rcIts.UPC',
                    'qty': '$rcIts.qty',
                    'userID': 1,
                    'shipBy': 1,
                    'crtTm': 1,
                    'mdfTm': 1,
                    'status': 1,
                    'sn': '$UPCandSN.SN'
                }
            }
        ]
    );

    if (fields["OrderId"]) {
        matchObj["orderID"] = new RegExp(`.*${fields["OrderId"]}.*`);
    }
    if (fields["trackingId"]) {
        matchObj["trackingID"] = new RegExp(`.*${fields["trackingId"]}.*`);
    }
    if (fields["orgNm"]) {
        matchObj["orgNm"] = new RegExp(`.*${fields["orgNm"]}.*`);
    }
    if (fields["upc"]) {
        matchObj["upc"] = new RegExp(`.*${fields["upc"]}.*`);
    }
    if (fields["sn"]) {
        matchObj['UPCandSN.SN'] = fields["sn"];
    }

    if (Object.entries(matchObj).length > 0) {
        compoundFilter.push({ '$match': matchObj })
    }
    return compoundFilter;
}

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
                '_id': 0,
                'trackingID': '$trNo',
                'orgNm': 1,
                'upc': '$rcIts.UPC',
                'qty': '$rcIts.qn',
                'userID': 1,
                'shipBy': 1,
                'crtTm': 1,
                'mdfTm': 1,
                'status': 1,
            }
        }
    ]);

    if (fields["trackingId"]) {
        matchObj["trackingID"] = new RegExp(`.*${fields["trackingId"]}.*`);
    }
    if (fields["orgNm"]) {
        matchObj["orgNm"] = new RegExp(`.*${fields["orgNm"]}.*`);
    }
    if (fields["upc"]) {
        matchObj["upc"] = new RegExp(`.*${fields["upc"]}.*`);
    }
    if (fields["sn"]) {
        matchObj['UPCandSN.SN'] = fields["sn"];
    }

    if (Object.entries(matchObj).length > 0) {
        compoundFilter.push({ '$match': matchObj })
    }
    return compoundFilter;
}


export const GET_INVENTORY_LOCATION_BY_COMPOUND_FILTER = (fields) => {
    let compoundFilter = [];
    let matchObj = {};
    compoundFilter = compoundFilter.concat([
        {
            '$project': {
                '_id': 0,
                'upc': '$_id.UPC',
                'loc': '$_id.loc',
                'qty': 1,
                'mdfTm': 1,
            }
        }
    ]);

    if (fields["loc"]) {
        matchObj["loc"] = new RegExp(`.*${fields["loc"]}.*`);
    }
    // if (fields["qty"]) {
    //     matchObj["qty"] = new RegExp(`.*${fields["qty"]}.*`);
    // }
    if (fields["upc"]) {
        matchObj["upc"] = new RegExp(`.*${fields["upc"]}.*`);
    }

    if (Object.entries(matchObj).length > 0) {
        compoundFilter.push({ '$match': matchObj })
    }
    return compoundFilter;
}