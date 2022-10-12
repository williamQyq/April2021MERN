import { GoogleAuth } from 'google-auth-library';
import { google, sheets_v4 } from 'googleapis';
// import {gCredentials} from '#root/config.js';

export interface Form {
    spreadSheetId: string,
    range?: string,
    ranges?: string[]
}

export interface ForUploadForm extends Form {
    rowData: {
        _id: string,
        mdfTmEst: string,
        orgNm: string,
        UPC: string,
        trNo: string,
        qty: number
    } | undefined
}

export interface NeedToShipForm extends Form {
    rowData?: {
        _id: string,
        amzOrderId: string,
        tracking: string,
        upc: string,
        bundleUpcs: string[],
        RmaUpc: string
    } | undefined
}

class GSpreadSheet {
    private static _scopes: string = "https://www.googleapis.com/auth/spreadsheets";
    private static _credentials: any = {};
    private _auth: GoogleAuth;
    constructor() {
        this._auth = new google.auth.GoogleAuth({
            keyFile: "bin/gsheet/credentials.json",
            scopes: GSpreadSheet._scopes,
            // credentials: GSpreadSheet._credentials
        })
    }

    async __initSpreadSheet(): Promise<sheets_v4.Resource$Spreadsheets> {
        const authClient = await this._auth.getClient();
        const googleSheets: sheets_v4.Sheets = google.sheets({ version: "v4", auth: authClient });
        const spreadSheet: sheets_v4.Resource$Spreadsheets = googleSheets.spreadsheets;
        return spreadSheet;
    }
}

export class GSheet extends GSpreadSheet {
    async updateSheet(rowData: Form, aoa: [[]]): Promise<void> {
        return;
    }

    async readSheet(spreadsheetId: string, range: string): Promise<sheets_v4.Schema$ValueRange> {
        const spreadSheet: sheets_v4.Resource$Spreadsheets = await this.__initSpreadSheet();
        const sheetData = (await spreadSheet.values.get({ spreadsheetId, range })).data;
        return sheetData;
    }

    async batchReadSheet(spreadsheetId: string, ranges: string[]): Promise<sheets_v4.Schema$BatchGetValuesResponse> {
        const spreadSheet = await this.__initSpreadSheet();
        const data = (await spreadSheet.values.batchGet({
            spreadsheetId,
            ranges,
            majorDimension: "ROWS"
        })).data;

        return data;
    }
}

export class GSheetForUpload extends GSheet {
    public static _form: ForUploadForm = {
        spreadSheetId: "14lDiRT1Hfwfd63wvPBXoJGluXs66LejPO9nMYCc-Jok",
        range: "forUpload!A:F",
        rowData: undefined
    }
}

export class GSheetNeedToShip extends GSheet {
    public static _form: NeedToShipForm = {
        spreadSheetId: "1Pgk6x0Dflq6FwMLk2qIyU9QgHH8RZNneYWLWMk3J2qM",
        ranges: ["needtoship!I:I", "needtoship!J:J", "needtoship!AV:AV", "needtoship!AD:AD", "needtoship!AE:AF", "needtoship!AG:AH", "needtoship!AI:AJ", "needtoship!AK:AL"],
        rowData: undefined
    }
    public static _needUpgradeform: NeedToShipForm = {
        spreadSheetId: "1Pgk6x0Dflq6FwMLk2qIyU9QgHH8RZNneYWLWMk3J2qM",
        ranges: ["needtoship!J2:J", "needtoship!AB2:AB"],
    }

    async getNeedToShipUpgradeTasks(): Promise<Set<string | undefined>> {
        const { spreadSheetId, ranges } = GSheetNeedToShip._needUpgradeform;
        const upgradeTrackingSet = new Set<string>();
        const res = await this.batchReadSheet(spreadSheetId, ranges as string[])

        let trackings: string[] = res.valueRanges![0].values?.flat() as string[];
        let forUpgradeResults = res.valueRanges![1].values?.flat() as Array<undefined | "yes">;

        //load each need upgrade trackings to Set.
        forUpgradeResults?.forEach((isTaskForUpgrade, index) => {
            if (isTaskForUpgrade === "yes" && trackings !== undefined) {
                upgradeTrackingSet.add(trackings[index])
            }
        })
        return upgradeTrackingSet;
    }
}

