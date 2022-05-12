import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import moment from 'moment';

const SellerInvSchema = new Schema({
    _id: {
        UPC: {
            type: String,
            require: true,
        },
        org: {
            type: String,
            require: true
        }
    },
    mdfStmp: {
        type: Date,
        default: Number(Date.now)
    },
    mdfTm: {
        type: Date,
        default: moment.tz(Date.now, "America/New_York").format() + "EST"
    }
})

export default mongoose.model('sellerInv', SellerInvSchema);
