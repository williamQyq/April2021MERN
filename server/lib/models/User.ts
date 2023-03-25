import mongoose from 'mongoose';
import { IUserDoc } from './interface';
const Schema = mongoose.Schema;

//Create Schema
const UserSchema = new Schema<IUserDoc>({
    _id: { type: Schema.Types.ObjectId, auto: true },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        default: 'member',
        enum: ['admin', 'member'],
        require: true
    },
    register_date: {
        type: Date,
        default: Date.now
    },
    googleId: {
        type: String,
    },
    name: {
        type: String,
    },
    photo: {
        type: String
    }

}, { collection: 'users' });

export default mongoose.model<IUserDoc>('user', UserSchema);