import Joi from 'joi';

const DiaryJoiSchema = Joi.object({
    best_part: Joi.string().min(3).max(500).required(),
    body: Joi.string().min(3).max(3000).required(),
    tags: Joi.array().items(Joi.string().min(3).max(200).required()).max(10),
    date: Joi.date()
})

const DateJoiSchema = Joi.object({
    startOfTheMonth: Joi.date().required(),
    endOfTheMonth: Joi.date().required()
})

interface Diary {
    _id: string;
    user: string;
    best_part?: string;
    body?: string;
    tags?: Array<string>;
    date: Date;
}

export type {
    Diary
}

export {
    DiaryJoiSchema,
    DateJoiSchema
}