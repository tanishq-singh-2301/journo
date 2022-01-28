import Joi from 'joi';

const ListJoiSchema: Joi.ObjectSchema = Joi.object({
    title: Joi.string().min(3).max(300).required(),
    description: Joi.string().min(3).max(1000).required(),
    time: Joi.date(),
    _id: Joi.string()
})

const EventJoiSchema: Joi.ObjectSchema = Joi.object({
    _id: Joi.string(),
    name: Joi.string().min(3).max(500).required(),
    date: Joi.date(),
    List: Joi.array().items(ListJoiSchema).max(15)
})

interface List {
    title: string;
    description: string;
    _id?: string;
    time: Date
}

interface Event {
    _id: string;
    user?: string;
    name: string;
    List?: Array<List>
    date: Date;
}

export type {
    Event,
    List
}

export {
    EventJoiSchema,
    ListJoiSchema
}