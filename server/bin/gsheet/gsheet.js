import { google } from 'googleapis';
import { gCredentials } from '#root/config.js';

export default class GenerateGSheetApis {
    constructor() {
        this._scopes = "https://www.googleapis.com/auth/spreadsheets";
        this._credentials = gCredentials;
        this.auth = undefined;
    }
    async _getSpreadSheet() {
        this.auth = new google.auth.GoogleAuth({
            keyFile: "./bin/gsheet/credentials.json",
            scopes: this._scopes,
            // credentials: this._credentials
        })
        const authClientObject = await this.auth.getClient();
        const googleSheetsInstance = google.sheets({ version: "v4", auth: authClientObject });
        const spreadSheet = googleSheetsInstance.spreadsheets;

        return spreadSheet;
    }

}


