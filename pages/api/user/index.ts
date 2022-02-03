import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDB from '../../../database/connection';
import USER from '../../../database/models/user';
import { verifyToken } from '../../../utils/verifyToken';
import { UpdateLastUse } from '../../../utils/updateLastUse';
import { User, UserDP, UserDpSchema } from '../../../types/models/user';

type Response = {
    success: boolean;
    error?: string;
    data?: User;
}

const handler = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
    const { headers, method } = req;
    const token: string = (headers['authentication'] as string || " ").split(' ')[1];
    const { success, user } = verifyToken(token);
    const ip: string | string[] = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "-1";

    if (!success)
        return res.status(200).json({ success, error: "Authorization token not valid" });

    switch (method) {
        case "GET":
            try {
                await connectToDB();
                await USER.findById(user!._id)
                    .select(['-password', '-ip_created', '-date', '-ip_last_used', '-__v'])
                    .then(async (result: User) => {
                        await UpdateLastUse(ip, user!._id);
                        return res.status(200).json({ success: true, data: result });
                    })
                    .catch((error) => res.status(200).json({ success: false, error: error.message.replace(/\"/g, "") }))

            } catch (error) {
                return res.status(200).json({ success: false, error: "Please try again." })
            }
            break;

        default:
            return res.status(200).json({ success: false, error: 'This method does not exists.' })
    }
}

export default handler;