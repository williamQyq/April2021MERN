import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const WMItemSchema = new Schema({
    link: {
        type: String,
        require: true
    },
    sku: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    price_timestamps: [{
        price: {
            type: Number,
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    created_date: {
        type: Date,
        default: Date.now
    }
}, { collection: 'wmStoreListings' });

export default mongoose.model("WMItem", WMItemSchema)
