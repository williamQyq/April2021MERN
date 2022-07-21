import { Config } from "amazon-sp-api/lib/typings/baseTypes"

declare const WMS_CONFIG: {
    agent: string,
    username: string,

}
declare const AMZ_CREDENTIALS: Config.credentials;
declare const AMZ_REFRESH_TOKEN: Config.refresh_token
declare const REGION: Config.region