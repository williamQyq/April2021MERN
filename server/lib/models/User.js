import mongoose from 'mongoose';
const Schema = mongoose.Schema;

//Create Schema
const UserSchema = new Schema({
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
    }
}, { collection: 'users' });

export default mongoose.model('user', UserSchema);