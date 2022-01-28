import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDB from '../../../database/connection';
import USER from '../../../database/models/user';
import { verifyToken } from '../../../utils/verifyToken';

type Data = {
    success: boolean;
    error?: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { headers, method, body } = req;
    const token: string = (headers['authorization'] as string || " ").split(' ')[1];
    const { ip } = body;
    const { success, user } = verifyToken(token);

    if (!success)
        return res.status(200).json({ success, error: "Authorization token not valid" })

    switch (method) {
        case "POST":
            try {
                await connectToDB();
                await USER.findByIdAndUpdate(user?._id, {
                    $set: {
                        ip_last_used: ip
                    }
                })
                    .then(() => res.status(200).json({ success: true }))
                    .catch((error) => res.status(200).json({ success: false, error: error.message.replace(/\"/g, "") }));
            } catch (error) {
                return res.status(200).json({ success: false, error: "Please try again." })
            }
            break;

        default:
            return res.status(200).json({ success: false, error: 'This method does not exists.' })
    }
}

export default handler;