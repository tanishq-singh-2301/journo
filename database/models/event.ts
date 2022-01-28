import { model, models, Schema } from "mongoose";

const ListSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 300
    },
    description: {
        type: String,
        default: '',
        minlength: 3,
        maxlength: 1000
    },
    time: {
        type: Date,
        default: Date.now
    }
});

const EventSchema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 500
    },
    date: {
        type: Date,
        default: Date.now
    },
    List: {
        type: [ListSchema],
        required: false
    },
    ip_last_used: {
        type: String,
        required: false
    }
});

export default models.Event || model('Event', EventSchema);