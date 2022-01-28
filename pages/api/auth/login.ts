import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDB from '../../../database/connection';
import USER from '../../../database/models/user';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { UserLoginJoiSchema } from '../../../types/models/user';
import { UpdateLastUse } from '../../../utils/updateLastUse';

type Data = {
    success: boolean;
    token?: string;
    error?: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const ip: string | string[] = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "-1";

    switch (req.method) {
        case "POST":
            try {
                const { email, password } = req.body;
                const { error } = UserLoginJoiSchema.validate({ email, password })

                if (error)
                    return res.status(200).json({ success: false, error: error.message.replace(/\"/g, "") });

                await connectToDB();
                await USER.findOne({ email })
                    .then(async (result) => {
                        if (await compare(password, result.password)) {

                            await UpdateLastUse(ip, result._id);
                            const token: string = sign(
                                {
                                    _id: result._id,
                                    email: email,
                                    username: result.username,
                                },
                                process.env.JWT_SECRECT as string,
                                {
                                    expiresIn: 60 * 60 * 24 * 2 // 2 days
                                }
                            );

                            return res.status(200).json({ success: true, token });
                        } else throw "";
                    }).catch((error) => res.status(200).json({ success: false, error: error.message.replace(/\"/g, "") }));
            } catch (error) {
                res.status(200).json({ success: false, error: "Invalid Credentials" })
            }
            break;

        default:
            return res.status(200).json({ success: false, error: 'This method does not exists.' })
    }
}

export default handler;