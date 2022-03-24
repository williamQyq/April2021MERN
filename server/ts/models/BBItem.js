"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
import mongoose_1 from "mongoose";
const BBItemSchema = new mongoose_1.Schema({
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
exports.default = (0, mongoose_1.model)("BBItem", BBItemSchema);
