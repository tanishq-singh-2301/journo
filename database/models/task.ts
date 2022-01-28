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
    tags: {
        type: [String],
        default: ['']
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const TaskSchema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true
    },
    todo: [ListSchema],
    inProgress: [ListSchema],
    onHold: [ListSchema],
    done: [ListSchema],
    ip_last_used: {
        type: String,
        required: false
    }
});

export default models.Task || model('Task', TaskSchema);