import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDB from '../../../database/connection';
import EVENT from '../../../database/models/event';
import { verifyToken } from '../../../utils/verifyToken';
import type { Event } from '../../../types/models/event';
import { UpdateLastUse } from '../../../utils/updateLastUse';

type Response = {
    success: boolean;
    error?: string;
    data?: Event
}

const handler = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
    const { headers, method, query } = req;
    const token: string = (headers['authorization'] as string || " ").split(' ')[1];
    const { success, user } = verifyToken(token);
    const ip: string | string[] = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "-1";

    if (!success)
        return res.status(200).json({ success, error: "Authorization token not valid" });

    switch (method) {
        case "GET":
            try {
                await connectToDB();
                await EVENT.findOne({ _id: query.id, user: user?._id })
                    .then(async (result: Event) => {
                        await UpdateLastUse(ip, user?._id);
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