import { JwtPayload, verify } from 'jsonwebtoken';
import type { VerifyToken } from '../types/verifyToken';

const verifyToken = (token: string): VerifyToken => {
    try {
        const user: any = verify(token, process.env.JWT_SECRECT as string);

        return {
            success: true,
            user: user
        }

    } catch (error) {
        return {
            success: false
        }
    }
}

export {
    verifyToken
}