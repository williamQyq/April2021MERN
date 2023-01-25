import mongoose from "mongoose";
import { BBItem } from "./interface";
const { model, Schema } = mongoose;


const BBItemSchema = new Schema<BBItem>({
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
}, { collection: 'bbStoreListings' });

export default model<BBItem>("BBItem", BBItemSchema)
