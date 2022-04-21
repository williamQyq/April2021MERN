import { Schema, model } from 'mongoose';

const MostViewedItemSchema = new Schema({
    sku: {
        type: String,
        require: true,
        unique: true
    },
    names: {
        title: { type: String, require: true }
    },
    type: { enum: ['MOST_VIEWED', 'ULTIMATELY_BOUGHT'], require: true },

    images: {
        standard: { type: String }
    },
    timeseries: {
        timeField: { date: { type: Date, default: Date.now } },
        metaField: {
            customerReviews: {
                averageScore: { type: Number, },
                count: { type: Number }
            },
            prices: {
                regular: { type: Number },
                current: { type: Number, require: true },
            },
            rank: { type: Number, require: true },
        }
        // granularity: "hours"
    },
}, { collection: 'mostViewed' });

export default model("MostViewedItem", MostViewedItemSchema);