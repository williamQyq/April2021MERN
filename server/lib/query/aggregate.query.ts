import moment from "moment";
type Aggregate = Array<any>;

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
export function getPastDateInUnix(dayBefore: number) {
    let d = new Date();
    let day = d.getDate();
    d.setDate(day - dayBefore);

    // if (d.getMonth() == m) d.setDate(0);

    d.setHours(0, 0, 0, 0);
    let resultDate = Number(moment(d).format('x'))
    return resultDate;

}

export const GET_NEED_TO_SHIP_ITEMS_FOR_PICKUP_BY_TODAY: Aggregate = [
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

export const GET_UPC_LOCATION_QTY_EXCEPT_WMS = (upc: string): Aggregate => [
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

export const GET_UPC_BACK_UP_LOCS_FOR_PICK_UP = (upc:string):Aggregate => [
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

export const COUNT_CREATED_PICKUP_LABEL:Aggregate = [
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
