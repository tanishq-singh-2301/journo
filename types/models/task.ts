import Joi from 'joi';

const ListJoiSchema: Joi.ObjectSchema = Joi.object({
    title: Joi.string().min(3).max(300).required(),
    description: Joi.string().min(3).max(1000),
    tags: Joi.array().max(10).items(Joi.string().min(2).max(100)),
    time: Joi.date()
});

const TaskJoiSchema: Joi.ObjectSchema = Joi.object({
    todo: Joi.array().items(ListJoiSchema),
    inProgress: Joi.array().items(ListJoiSchema),
    onHold: Joi.array().items(ListJoiSchema),
    done: Joi.array().items(ListJoiSchema),
});

interface List {
    title: string;
    description: string;
    tags: Array<string>;
    _id: string;
    time: Date
}

interface Task {
    _id: string;
    user: string;
    todo: Array<List>;
    inProgress: Array<List>;
    onHold: Array<List>;
    done: Array<List>;
}

export type {
    Task,
    List
}

export {
    ListJoiSchema,
    TaskJoiSchema
}