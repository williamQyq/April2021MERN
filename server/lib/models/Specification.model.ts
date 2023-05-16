import mongoose from 'mongoose';
import { WithId } from 'mongodb';
const Schema = mongoose.Schema;

export interface ItemSpecDocument extends WithId<mongoose.Document> {
    sku: string;
    upc: string;
    spec: { [key: string]: string };
}

//Create Schema for self tracking list 
const ItemSpecSchema = new Schema({
    upc: {
        type: String,
        require: true
    },
    sku: {
        type: String,
        require: true
    },
    source: {
        type: String,
    },
    spec: {
        type: Object,
        require: true
    },
    rams: [{
        capacity: {
            type: Number
        },
        isOnBoard: {
            type: Boolean
        }
    }],
    storage: [{
        capacity: {
            type: Number
        },
        isSSD: {
            type: Boolean
        },
        isHDD: {
            type: Boolean
        }
    }]

}, { collection: 'itemSpec' });

export default mongoose.models.ItemSpec || mongoose.model('ItemSpec', ItemSpecSchema)
