import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '#root/config.js';
import { IResponseErrorMessage } from '#root/@types/interface';

export default function auth<T = any>(req: Request, res: Response, next: NextFunction): Response<T> | void {
    const token: string = req.header('x-auth-token')!;

    if (!token) {
        let errMsg: IResponseErrorMessage = {
            msg: "authorization denied"
        }
        return res.status(401).json(errMsg)
    }

    try {
        const decoded: string | jwt.JwtPayload = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (e) {
        let errMsg: IResponseErrorMessage = { msg: "Token is not valid" }
        res.status(400).json(errMsg);
    }
}