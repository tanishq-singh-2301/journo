import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDB from '../../../database/connection';
import TASK from '../../../database/models/task';
import { verifyToken } from '../../../utils/verifyToken';
import type { Task } from '../../../types/models/task';
import { TaskJoiSchema } from '../../../types/models/task';
import { UpdateLastUse } from '../../../utils/updateLastUse';

type Response = {
    success: boolean;
    error?: string;
    data?: Array<Task>
}

const handler = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
    const { headers, method, body } = req;
    const token: string = (headers['authentication'] as string || " ").split(' ')[1];
    const { success, user } = verifyToken(token);
    const ip: string | string[] = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "-1";

    if (!success)
        return res.status(200).json({ success, error: "Authorization token not valid" })

    switch (method) {
        case "GET":
            try {
                await connectToDB();
                await TASK.findOne({ user: user?._id })
                    .then(async (result: Array<Task>) => {
                        await UpdateLastUse(ip, user?._id);
                        return res.status(200).json({ success: true, data: result });
                    }).catch((error) => res.status(200).json({ success: false, error: error.message.replace(/\"/g, "") }));

            } catch (error) {
                return res.status(200).json({ success: false, error: "Please try again." })
            }
            break;

        case "PUT":
            try {
                const { data, updateId } = body;
                const { error, value } = TaskJoiSchema.validate(data || {});

                if (error)
                    return res.status(200).json({ success: false, error: error.message.replace(/\"/g, "") });

                if (!updateId)
                    return res.status(200).json({ success: false, error: "Update-Id is missing, from body" });

                await connectToDB();
                await TASK.findOneAndUpdate({ _id: updateId, user: user?._id }, value)
                    .then(async () => {
                        await UpdateLastUse(ip, user?._id);
                        return res.status(200).json({ success: true });
                    }).catch((error) => res.status(200).json({ success: false, error: error.message.replace(/\"/g, "") }));

            } catch (error) {
                return res.status(200).json({ success: false, error: "Please try again." })
            }
            break;

        default:
            return res.status(200).json({ success: false, error: 'This method does not exists.' })
    }
}

export default handler;