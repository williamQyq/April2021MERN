import { model, Schema } from "mongoose";

//Create Schema for self tracking list 
export interface BBItem {
    link: URL;
    sku: string;
    name: string;
    price_timestamps: Array<{ price: number, date: Date }>;
    created_date: Date;
}

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
