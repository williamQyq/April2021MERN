import mongoose from "mongoose";
import { IPrimeCost } from "./interface";
const { Schema } = mongoose;

const PrimeCostSchema = new Schema<IPrimeCost>({
    _id: {
        upc: {
            type: Schema.Types.String,
            required: true
        }
    },
    name: {
        type: Schema.Types.String,
        required: true,
    },
    price: {
        type: Schema.Types.Number,
        required: true,
    },
    category: {
        type: Schema.Types.String,
    },
    // price_timestamp: Array<{ price: number, date: Date }>,
    created_date: {
        type: Schema.Types.Date,
        default: Date.now
    }
}, { collection: "primeCost" });

export default mongoose.model<IPrimeCost>("PrimeCost", PrimeCostSchema);