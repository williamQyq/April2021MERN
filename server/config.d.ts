import { Config as amazonSpApiConfig } from "amazon-sp-api/lib/typings/baseTypes";
import { Config as sshTunnelConfig } from "tunnel-ssh";

export declare const sshConfig: sshTunnelConfig;

export declare const wmsCollections: {
    [collection: string]: string
}

export declare const AMZ_CREDENTIALS: amazonSpApiConfig.credentials;
export declare const AMZ_REFRESH_TOKEN: amazonSpApiConfig.refresh_token
export declare const REGION: amazonSpApiConfig.region

export declare const pdfGeneratorDirPath: string
export declare const JWT_SECRET: string

export declare const gOAuth: {
    clientID: string
    clientSecret: string
    callbackURL: string
}