import mongoose from "mongoose";
import { BestbuyDealDoc } from "./interface";

const { Schema } = mongoose;


const BBItemSchema = new Schema<BestbuyDealDoc>({
    link: {
        type: Schema.Types.String,
        require: true
    },
    sku: {
        type: Schema.Types.String,
        require: true
    },
    name: {
        type: Schema.Types.String,
        require: true
    },
    price_timestamps: [{
        price: {
            type: Schema.Types.Number,
        },
        date: {
            type: Schema.Types.Date,
            default: Date.now
        }
    }],
    created_date: {
        type: Schema.Types.Date,
        default: Date.now
    }
}, { collection: 'bbStoreListings' });

export default mongoose.model<BestbuyDealDoc>("BBItem", BBItemSchema)
