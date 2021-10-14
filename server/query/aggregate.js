// @get aggregate query

const getCurPrice = {
    $arrayElemAt: [
        "$price_timestamps.price", -1
    ]
}
const getPrevPrice = {
    $arrayElemAt: [
        "$price_timestamps.price", -2
    ]
}
const getPriceCaptureDate = {
    $arrayElemAt: [
        "$price_timestamps.date", -1
    ]
}
const getPriceDiff = {
    $subtract: [getCurPrice, getPrevPrice]
}

// @sort aggregate query
const sortOnPriceCaptureDate = {
    $sort: {
        captureDate: -1
    }
}

// @update aggregate query

module.exports = {
    getCurPrice,
    getPrevPrice,
    getPriceDiff,
    getPriceCaptureDate,
    sortOnPriceCaptureDate,

};