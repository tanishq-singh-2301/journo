import Joi from 'joi';

const UserLoginJoiSchema = Joi.object({
    password: Joi.string().min(3).max(30).required(),
    email: Joi.string().email({ tlds: { allow: Boolean(process.env.EMAIL_TLDS as string) } }).min(7).max(40).required()
})

type UserLogin = {
    password: string;
    email: string;
}

export type {
    UserLogin
}

export {
    UserLoginJoiSchema
}