const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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


module.exports = mongoose.model("BBItem", BBItemSchema);
