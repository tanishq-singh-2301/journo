import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDB from '../../../database/connection';
import EVENT from '../../../database/models/event';
import { verifyToken } from '../../../utils/verifyToken';
import type { Event } from '../../../types/models/event';
import { EventJoiSchema } from '../../../types/models/event';
import { UpdateLastUse } from '../../../utils/updateLastUse';

type Response = {
    success: boolean;
    error?: string;
    data?: Array<Event>
}

const handler = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
    const { headers, method, body, cookies } = req;
    const token: string = (headers['authentication'] as string || " ").split(' ')[1] || cookies['authentication'];
    const { success, user } = verifyToken(token);
    const pageNumber: number = parseInt(headers["page-number"] as string) || 1;
    const limit: number = 6;
    const ip: string | string[] = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "-1";

    if (!success)
        return res.status(200).json({ success, error: "Authorization token not valid" })

    switch (method) {
        case "GET":
            try {
                await connectToDB();
                await EVENT.find({ user: user?._id })
                    .skip((pageNumber - 1) * limit)
                    .limit(limit)
                    .sort({ date: -1 })
                    .select(['-user', '-__v', '-List[]_id'])
                    .then(async (result: Array<Event>) => {
                        await UpdateLastUse(ip, user?._id);
                        return res.status(200).json({ success: true, data: result });
                    }).catch((error) => res.status(200).json({ success: false, error: error.message.replace(/\"/g, "") }));

            } catch (error) {
                return res.status(200).json({ success: false, error: "Please try again." })
            }
            break;

        case "POST":
            try {
                const { data } = body;
                const { error, value } = EventJoiSchema.validate(data || {});

                if (error)
                    return res.status(200).json({ success: false, error: error.message.replace(/\"/g, "") });

                await connectToDB();
                await EVENT.create({ ...value, user: user!._id })
                    .then(async (result: Event) => {
                        await UpdateLastUse(ip, user!._id);
                        return res.status(200).json({
                            success: true, data: [{
                                _id: result._id,
                                name: result.name,
                                List: result.List,
                                date: result.date
                            }]
                        });
                    }).catch((error) => res.status(200).json({ success: false, error: error.message.replace(/\"/g, "") }));

            } catch (error) {
                return res.status(200).json({ success: false, error: "Please try again." })
            }
            break;

        case "DELETE":
            try {
                const deleteId: string = headers['delete-id'] as string;

                if (!deleteId)
                    return res.status(200).json({ success: false, error: "Delete-Id is missing, from headers" });

                await connectToDB();
                await EVENT.findOneAndDelete({ _id: deleteId, user: user?._id })
                    .then(async () => {
                        await UpdateLastUse(ip, user?._id);
                        return res.status(200).json({ success: true });
                    }).catch((error) => res.status(200).json({ success: false, error: error.message.replace(/\"/g, "") }));

            } catch (error) {
                return res.status(200).json({ success: false, error: "Please try again." })
            }
            break;

        case "PUT":
            try {
                const { data, updateId } = body;
                const { error, value } = EventJoiSchema.validate(data || {});

                if (error)
                    return res.status(200).json({ success: false, error: error.message.replace(/\"/g, "") });

                if (!updateId)
                    return res.status(200).json({ success: false, error: "Update-Id is missing, from body" });

                await connectToDB();
                await EVENT.findOneAndUpdate({ _id: updateId, user: user?._id }, value)
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