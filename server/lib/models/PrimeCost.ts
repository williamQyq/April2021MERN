import mongoose, { Document } from "mongoose";

const { model, Schema } = mongoose;

export interface IPrimeCost extends Document {
    name: string;
    upc: string;
    price: number;
    // price_timestamps: Array<{ price: number, date: Date }>;
    created_date: Date;
}

const PrimeCostSchema = new Schema<IPrimeCost>({
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