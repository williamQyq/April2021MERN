import { JwtPayload } from "jsonwebtoken";
import { IUserDoc } from "./lib/models/interface";

declare global {
    namespace Express {
        interface User extends IUserDoc { }
        interface Request {
            user?: JwtPayload<{ id: number, iat: number, exp: number }>
        }
    }
}