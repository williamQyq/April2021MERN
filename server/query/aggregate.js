// @get aggregate query

const CUR_PRICE = {
    $arrayElemAt: [
        "$price_timestamps.price", -1
    ]
}
const PREV_PRICE = {
    $arrayElemAt: [
        "$price_timestamps.price", -2
    ]
}
const PRICE_CAPTURE_DATE = {
    $arrayElemAt: [
        "$price_timestamps.date", -1
    ]
}
const PRICE_DIFF = {
    $subtract: [CUR_PRICE, PREV_PRICE]
}

// @sort aggregate query
const SORT_ON_CAPTURE_DATE = {
    $sort: {
        captureDate: -1
    }
}

//@project aggregate query
const PROJ_ITEM = {
    $project: {
        key: "$_id",
        link: 1,
        name: 1,
        sku: 1,
        qty: 1,
        upc: 1,
        currentPrice: CUR_PRICE,
        isCurrentPriceLower: {
            $lt: [CUR_PRICE, PREV_PRICE]
        },
        priceDiff: PRICE_DIFF,
        captureDate: PRICE_CAPTURE_DATE
    }
}

const PROJ_ITEM_DETAIL = {
    $project: {
        link: 1,
        name: 1,
        sku: 1,
        qty: 1,
        upc: 1,
        price_timestamps: 1,
        currentPrice: CUR_PRICE,
        priceDiff: PRICE_DIFF,
    }
}
// @update aggregate query
module.exports = {
    PROJ_ITEM,
    PROJ_ITEM_DETAIL,
    SORT_ON_CAPTURE_DATE,
}