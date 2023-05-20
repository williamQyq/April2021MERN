import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { IResponseErrorMessage } from '#root/@types/interface';
import config from 'config';
/**
 * 
 * @description my customized legacy jwt auth process  
 */
export default function auth<T = any>(req: Request, res: Response, next: NextFunction): Response<T> | void {
    // Passport OAuth authenticated user.
    if (req.isAuthenticated()) {
        next();
        return;
    }

    // Legacy JWT authenticated user.
    const token: string | undefined = req.header('x-auth-token');
    const JWT_SECRET = config.get('JWT_SECRET') as string;
    if (!token) {
        let errMsg: IResponseErrorMessage = {
            msg: "authorization denied"
        }
        return res.status(401).json(errMsg)
    }

    try {
        const decoded: string | jwt.JwtPayload = jwt.verify(token, JWT_SECRET);
        req.user = decoded; //{id: user._id, iat: number, exp: number}
        next();

    } catch (e) {
        let now = new Date();
        console.log(`[${now}] unauthorized request.`);
        let errMsg: IResponseErrorMessage = { msg: "Token is not valid" }
        res.status(401).json(errMsg);
    }
}

export function ensureAuth(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        // console.log("OAuth Authenticated");
        next();
    } else {
        console.log("Not OAuth Authenticated");
        let errorMsg: IResponseErrorMessage = {
            msg: "Not OAuth Authenticated"
        }
        res.status(401).json(errorMsg)
    }
}

export function ensureGuest(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        console.log("Authenticated");
        res.json("already authenticated");
        // res.redirect('/dashboard')

    } else {
        console.log("Not Authenticated");
        return next();
    }
}

