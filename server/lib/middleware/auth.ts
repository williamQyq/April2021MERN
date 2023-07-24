import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { IResponseErrorMessage } from '#root/@types/interface';
import config from 'config';
import User from 'lib/models/User';

const ORIGIN: string = process.env.NODE_ENV === "production" ?
    config.get<string>("origin.prod")
    : config.get<string>("origin.dev");


/**
 * 
 * @description ensure request is authenticated  
 */
export default function auth<T = any>(req: Request, res: Response, next: NextFunction): Response<T> | void {
    // Passport OAuth authenticated user.
    if (req.isAuthenticated()) {
        next();
        return
    }

    // Legacy JWT authenticated user.
    const token: string | undefined = req.header('x-auth-token');
    if (!token) {
        const errMsg: IResponseErrorMessage = {
            msg: "Authorization denied"
        }
        res.status(401).json(errMsg);
        return;
    }

    try {
        const JWT_SECRET = config.get<string>('JWT_SECRET');
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

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * @description 
 *  ensure login is authenticated, else redirect
 */
export function ensureAuth(req: Request, res: Response, next: NextFunction) {
    const token: string | undefined = req.header('x-auth-token');
    const JWT_SECRET = config.get<string>("JWT_SECRET");
    const errorMsg: IResponseErrorMessage = {
        msg: "Not OAuth Authenticated"
    }

    try {
        if (req.isAuthenticated()) { // is OAuth?
            next();
        } else if (token) { // is JWT authenticated?
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
            // User.findById(req.user._id).select('-password').then(user => req.user = user);
            next();
        } else {
            res.status(401).json(errorMsg);
        }
    } catch (err: unknown) {
        console.error("Not OAuth Authenticated");
        res.status(401).json(errorMsg);
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

