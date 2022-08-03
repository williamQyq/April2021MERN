// @get aggregate query
import moment from "moment";

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
            'status': "ready"
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
            'status': "ready"
        }
    }, {
        '$count': "shipmentCount"
    }
]

export const COUNT_PENDING_SHIPMENT_BY_TODAY = () =>
    [
        {
            '$facet': {
                'total': [
                    {
                        '$match': {
                            'orderID': {
                                '$exists': true
                            },
                            'crtStmp': {
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
                            'crtStmp': {
                                '$gte': getTodayDate()
                            },
                            'status': {
                                '$eq': 'ready'
                            }
                        }
                    }, {
                        '$count': 'pending'
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
                }
            }
        }
    ]
//@params dateMax, dateMin: Unix date
export const GET_UNVERIFIED_SHIPMENT = (dateMin, dateMax) => [
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
        }
    }, {
        '$match': {
            'crtStmp': {
                '$gte': dateMin,
                '$lt': dateMax
            },
            '$expr': {
                '$and': [
                    { 'status': { "$ne": ["$status", "ready"] } },
                    { 'status': { "$ne": ["$status", "substantiated"] } }
                ]
            }
        }
    }, {
        '$sort': {
            'crtStmp': 1
        }
    }
]