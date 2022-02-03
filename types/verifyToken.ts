import { JwtPayload } from "jsonwebtoken"

interface User {
    _id: string;
    email: string;
    username: string;
}

type VerifyToken = {
    success: boolean;
    user?: User
}

export type {
    VerifyToken,
    User
}