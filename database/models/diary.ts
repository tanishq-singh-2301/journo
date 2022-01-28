import { model, models, Schema } from "mongoose";

const DiarySchema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true
    },
    best_part: {
        type: String,
        default: '',
        minlength: 3,
        maxlength: 500
    },
    body: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 3000
    },
    tags: {
        type: [String],
        default: ['']
    },
    date: {
        type: Date,
        default: Date.now
    },
    ip_last_used: {
        type: String,
        required: false
    }
});

export default models.Diary || model('Diary', DiarySchema);