import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { JWT_SECRET } from '#root/config.js';
import { IResponseErrorMessage } from '#root/@types/interface';

/**
 * 
 * @description my customized legacy jwt auth process  
 */
export function auth<T = any>(req: Request, res: Response, next: NextFunction): Response<T> | void {
    const token: string | undefined = req.header('x-auth-token');

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
        console.log("OAuth Authenticated");
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

