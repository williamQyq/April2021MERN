import { NextFunction, Request } from "express";
/*
    @desc: express response timeout status 500
*/
export default function connectionTimeout(time: number = 15000) {
    return function (req: Request, res: Response, next: NextFunction) {
        //timeout response status 500
        req.setTimeout(time);
        next();
    }
}