import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDB from '../../../database/connection';
import USER from '../../../database/models/user';
import TASK from '../../../database/models/task';
import EVENT from '../../../database/models/event';
import DIARY from '../../../database/models/diary';
import Joi from 'joi';
import { genSalt, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';

type Data = {
    success: boolean;
    token?: string;
    error?: string;
}

const UserSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().min(7).max(40).required()
})

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    switch (req.method) {
        case "POST":
            try {

                const ip: string | string[] | null = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
                const { username, email, password } = req.body;
                const { error, value } = UserSchema.validate({ username, email, password })

                if (error)
                    return res.status(200).json({ success: false, error: error.message.replace(/\"/g, "") });

                await connectToDB();

                const salt = await genSalt(8);
                const hashPassword = await hash(password, salt);

                await USER.create({
                    username: value.username,
                    password: hashPassword,
                    email: value.email,
                    ip_created: ip,
                })
                    .then(async (result) => {

                        await TASK.create({
                            user: result._id,
                            todo: [{
                                title: "Complete Inspection",
                                description: "Complete municipality and internal inspection (foundation, farming and QO).",
                                tags: "Ventilation Maintenance"
                            }]
                        }).catch(() => { });

                        await DIARY.create({
                            user: result._id,
                            best_part: "Lunch with Steven",
                            body: "all about my day ...",
                            tags: ['long', 'funny', 'great']
                        }).catch(() => { });

                        await EVENT.create({
                            user: result._id,
                            name: "Final Exams",
                            List: [{
                                title: "Mathematics",
                                description: "Trigonometery, Circles, Permutation and Combination"
                            }]
                        }).catch(() => { });

                        const token: string = sign({ username: result.username, email, _id: result._id }, process.env.JWT_SECRECT as string);
                        return res.status(200).json({ success: true, token })
                    })
                    .catch(err => {
                        if (err.code === 11000)
                            res.status(200).json({ success: false, error: "This email id already exists." })

                        else
                            throw "";
                    })
            } catch (error) {
                res.status(200).json({ success: false, error: "Please try again." })
            }
            break;

        default:
            return res.status(200).json({ success: false, error: 'This method does not exists.' })
    }
}

export default handler;