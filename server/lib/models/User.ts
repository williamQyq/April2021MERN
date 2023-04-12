import mongoose from 'mongoose';
import { IUserDoc } from './interface';
const Schema = mongoose.Schema;

//Create Schema
const UserSchema = new Schema<IUserDoc>({
    _id: { type: Schema.Types.ObjectId, auto: true },
    email: {
        type: Schema.Types.String,
        // require: true,
        allowNull: true
        // unique: true
    },
    password: {
        type: Schema.Types.String,
        allowNull: true
        // require: true
    },
    role: {
        type: Schema.Types.String,
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
        allowNull: true,
    },
    name: {
        type: String,
        allowNull: true
    },
    photo: {
        type: String,
        allowNull: true
    }

}, { collection: 'users' });

export default mongoose.model<IUserDoc>('user', UserSchema);