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
            _id: 1,
            mdfTmEst: '$mdfTm',
            mdfDate: {
                '$dateToString': {
                    'date': {
                        '$toDate': '$mdfTm'
                    }
                }
            },
            orgNm: 1,
            UPC: '$rcIts.UPC',
            trNo: 1,
            qty: '$rcIts.qn'
        }
    }, {
        $match: {
            mdfDate: {
                '$gte': getDateHalfMonthAgo()
            }
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

export function getDateHalfMonthAgo() {
    let d = new Date();
    let day = d.getDate();
    d.setDate(day - 14);

    // if (d.getMonth() == m) d.setDate(0);

    d.setHours(0, 0, 0, 0);

    return moment(d).format();

}