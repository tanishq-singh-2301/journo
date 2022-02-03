import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDB from '../../../database/connection';
import DIARY from '../../../database/models/diary';
import { verifyToken } from '../../../utils/verifyToken';
import type { Diary } from '../../../types/models/diary';
import { DiaryJoiSchema } from '../../../types/models/diary';
import moment from 'moment';
import { UpdateLastUse } from '../../../utils/updateLastUse';

type Response = {
    success: boolean;
    error?: string;
    data?: Array<Diary>
}

const handler = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
    const token: string = (req.headers['authorization'] as string || " ").split(' ')[1];
    const { success, user } = verifyToken(token);
    const ip: string | string[] = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "-1";

    if (!success)
        return res.status(200).json({ success, error: "Authorization token not valid" })

    switch (req.method) {
        case "GET":
            try {
                const startOfTheMonth: Date = new Date((req.headers['start-of-the-month'] as string).split("T")[0] || moment().startOf('month').toDate());
                const endOfTheMonth: Date = new Date((req.headers['end-of-the-month'] as string).split("T")[0] || moment().endOf('month').toDate());

                await connectToDB();
                await DIARY.find({
                    user: user!._id,
                    date: {
                        $gte: startOfTheMonth,
                        $lt: endOfTheMonth
                    }
                })
                    .then(async (result: Array<Diary>) => {
                        await UpdateLastUse(ip, user?._id);
                        return res.status(200).json({ success: true, data: result });
                    }).catch((error) => res.status(200).json({ success: false, error: error.message.replace(/\"/g, "") }));

            } catch (error) {
                res.status(200).json({ success: false, error: "Please try again." })
            }
            break;

        case "POST":
            try {
                const { data } = req.body;
                const { error, value } = DiaryJoiSchema.validate(data || {});

                if (error)
                    return res.status(200).json({ success: false, error: error.message.replace(/\"/g, "") });

                await connectToDB();
                await DIARY.create({ ...value, user: user?._id })
                    .then(async (result: Diary) => {
                        await UpdateLastUse(ip, user?._id);
                        return res.status(200).json({ success: true, data: [result] });
                    }).catch((error) => res.status(200).json({ success: false, error: error.message.replace(/\"/g, "") }));

            } catch (error) {
                res.status(200).json({ success: false, error: "Please try again." })
            }
            break;

        case "DELETE":
            try {
                const deleteId: string = (req.headers['delete-id'] as string);

                if (!deleteId)
                    return res.status(200).json({ success: false, error: "Delete-Id is missing, from headers" });

                await connectToDB();
                await DIARY.findOneAndDelete({ _id: deleteId, user: user?._id })
                    .then(async () => {
                        await UpdateLastUse(ip, user?._id);
                        return res.status(200).json({ success: true });
                    }).catch((error) => res.status(200).json({ success: false, error: error.message.replace(/\"/g, "") }));

            } catch (error) {
                res.status(200).json({ success: false, error: "Please try again." })
            }
            break;

        case "PUT":
            try {
                const { data, updateId } = req.body;
                const { error, value } = DiaryJoiSchema.validate(data || {});

                if (error)
                    return res.status(200).json({ success: false, error: error.message.replace(/\"/g, "") });

                if (!updateId)
                    return res.status(200).json({ success: false, error: "Update-Id is missing, from body" });

                await connectToDB();
                await DIARY.findOneAndUpdate({ _id: updateId, user: user?._id }, value)
                    .then(async () => {
                        await UpdateLastUse(ip, user?._id);
                        return res.status(200).json({ success: true });
                    }).catch((error) => res.status(200).json({ success: false, error: error.message.replace(/\"/g, "") }));

            } catch (error) {
                res.status(200).json({ success: false, error: "Please try again." })
            }
            break;

        default:
            return res.status(200).json({ success: false, error: 'This method does not exists.' })
    }
}

export default handler;