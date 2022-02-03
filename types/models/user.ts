import Joi from 'joi';

const UserLoginJoiSchema = Joi.object({
    password: Joi.string().min(3).max(30).required(),
    email: Joi.string().email({ tlds: { allow: Boolean(process.env.EMAIL_TLDS as string) } }).min(7).max(40).required()
});

const UserDpSchema = Joi.object({
    base64: Joi.string().required(),
    imageType: Joi.string().required()
})

type UserLogin = {
    password: string;
    email: string;
}

type UserDP = {
    base64: string;
    imageType: string
}

type User = {
    _id: string;
    email: string;
    username: string;
    image: UserDP
}

export type {
    UserLogin,
    UserDP,
    User
}

export {
    UserLoginJoiSchema,
    UserDpSchema
}