import mongoose, { Document } from "mongoose";
import { IPrimeCost } from "./interface";
const { model, Schema } = mongoose;

const PrimeCostSchema = new Schema<IPrimeCost>({
    _id: {
        type: {
            upc: String,
        },
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    // price_timestamp: Array<{ price: number, date: Date }>,
    created_date: {
        type: Date,
        default: Date.now
    }
}, { collection: "primeCost" });

export default model<IPrimeCost>("PrimeCost", PrimeCostSchema);