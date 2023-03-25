import { NextFunction, Request } from "express";
/*
    @desc: express response timeout status 500
*/
export default function connectionTimeout(ms: Number) {
    let time = typeof ms === 'number' ? ms : 15000;
    return function (req: Request, res: Response, next: NextFunction) {
        //timeout response status 500
        req.setTimeout(time);
        next();
    }
}