import { JwtPayload } from "jsonwebtoken";
import { IUserDoc } from "./lib/models/interface";

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "development" | "production" | "test";
            PORT: number;
            DB_URI: string;

            //selling partner secrete keys...
            AMZ_SELLING_PARTNER_APP_CLIENT_ID: string;
            AMZ_SELLING_PARTNER_APP_CLIENT_SECRET: string;
            AWS_ACCESS_KEY_ID: string;
            AWS_SECRET_ACCESS_KEY: string;
            AWS_SELLING_PARTNER_ROLE: string;
            AMZ_ROLE_ARN: string;
            AMZ_REFRESH_TOKEN: string;
            //*******************************/

            //wms db secrete keys...
            WMS_USERNAME: string;
            WMS_PASSWORD: string;
            WMS_HOST: string;
            SSH_PORT: number;
            WMS_DST_PORT: number;
            WMS_LOCAL_PORT: number;
            //*******************************/
            BESTBUY_API_KEY: string;

            private_key_id:string;
            private_key:string;

            GOOGLE_CLIENT_ID:string;
            GOOGLE_CLIENT_SECRET:string;
            private_key_id:string;
            
        }
    }

    namespace Express {
        interface User extends IUserDoc { }
        interface Request {
            user?: JwtPayload<{ id: number, iat: number, exp: number }>
        }
    }
}