import { Config } from "amazon-sp-api/lib/typings/baseTypes"

export declare const sshConfig: {
    agent: string,
    username: string,
    password: string,
    host: string,
    port: string,
    dstPort: string | null,
    localPort: string | null,
    keepAlive: boolean
}

export declare const wmsCollections: {
    [collection: string]: string
}

export declare const AMZ_CREDENTIALS: Config.credentials;
export declare const AMZ_REFRESH_TOKEN: Config.refresh_token
export declare const REGION: Config.region