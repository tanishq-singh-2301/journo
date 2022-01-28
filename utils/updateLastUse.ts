import connectToDB from "../database/connection";
import USER from '../database/models/user';

const UpdateLastUse = async (ip: string | string[], userId: string | undefined): Promise<{ success: boolean }> => {
    try {
        if (userId !== undefined) {
            await connectToDB();
            await USER.findByIdAndUpdate(userId, {
                $set: {
                    ip_last_used: ip
                }
            })
                .then(() => {
                    return {
                        success: true
                    }
                });
        }
    } catch (error) { }

    return {
        success: false
    }
}

export {
    UpdateLastUse
}