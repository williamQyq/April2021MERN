import dotenv from 'dotenv'
import path from 'path';
import { fileURLToPath } from 'url';
// import fs from 'fs'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();   //secrete keys in environment

export const WMS_CONFIG = {
    agent: process.env.SSH_AUTH_SOCK,
    username: process.env.WMS_USERNAME,
    password: process.env.WMS_PASSWORD,
    host: process.env.WMS_HOST,
    port: process.env.WMS_PORT,
    dstPort: process.env.WMS_DST_PORT,
    // privateKey: require('fs').readFileSync('/path/to/key'),
    localPort: process.env.PORT || process.env.WMS_LOCAL_PORT,
    keepAlive: true
}

export const AMZ_CREDENTIALS = {
    SELLING_PARTNER_APP_CLIENT_ID: process.env.AMZ_SELLING_PARTNER_APP_CLIENT_ID,
    SELLING_PARTNER_APP_CLIENT_SECRET: process.env.AMZ_SELLING_PARTNER_APP_CLIENT_SECRET,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_SELLING_PARTNER_ROLE: process.env.AWS_SELLING_PARTNER_ROLE
}

export const AMZ_REFRESH_TOKEN = process.env.AMZ_REFRESH_TOKEN
export const REGION = process.env.REGION

export const JWT_SECRET = process.env.JWT_SECRET
export const USER_AGENT = process.env.USER_AGENT

export const WM_RSA_PASS_PHASE = process.env.WM_RSA_PASS_PHASE 