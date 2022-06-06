import { google } from 'googleapis';

export const auth = new google.auth.GoogleAuth({
    keyFile: "./bin/gsheet/credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
})

const authClientObject = await auth.getClient();

const googleSheetsInstance = google.sheets({ version: "v4", auth: authClientObject });

export const sheet = googleSheetsInstance.spreadsheets;