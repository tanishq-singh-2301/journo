import { model, models, Schema } from "mongoose";

const UserSchema: Schema = new Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 7,
        maxlength: 40
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    ip_created: {
        type: String,
        required: false
    },
    ip_last_used: {
        type: String,
        required: false
    },
    imageUrl: String
});

export default models.Users || model('Users', UserSchema);