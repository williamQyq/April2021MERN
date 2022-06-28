import { model, Schema } from "mongoose";
const BBItemSchema = new Schema({
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
export default model("BBItem", BBItemSchema);
