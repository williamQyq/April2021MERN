import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { JWT_SECRET } from '#root/config.js';
import { IResponseErrorMessage } from '#root/@types/interface';

export function auth<T = any>(req: Request, res: Response, next: NextFunction): Response<T> | void {
    const token: string = req.header('x-auth-token')!;

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
        let errMsg: IResponseErrorMessage = { msg: "Token is not valid" }
        res.status(400).json(errMsg);
    }
}

export function ensureAuth(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        console.log("Authenticated");
        return next();
    } else {
        console.log("Not Authenticated");
        let errMsg: IResponseErrorMessage = {
            msg: "google authorization denied"
        }
        res.status(401).json(errMsg)
        // res.redirect('/')
    }
}

export function ensureGuest(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        console.log("Authenticated");
        res.json("already authenticated")
        // res.redirect('/dashboard')

    } else {
        console.log("Not Authenticated");
        return next();
    }
}

