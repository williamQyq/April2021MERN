import fs from 'fs';
import readline from 'readline';
import { google } from 'googleapis';

export const auth = new google.auth.GoogleAuth({
    keyFile: "./bin/gsheet/credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
})

const authClientObject = await auth.getClient();

const googleSheetsInstance = google.sheets({ version: "v4", auth: authClientObject });

// const spreadsheetId = "1xvMFkK3dvNwhHHXqRnJPLko_ouTZ5llyA3jYauxWPBM";
export const sheet = googleSheetsInstance.spreadsheets;

// const readData = await sheet.values.get({
//     auth, //auth object
//     spreadsheetId, // spreadsheet id
//     range: "Sheet2!A:B", //range of cells to read from.
// })
// let aoa = [["123",2323],["rewr",111]]
// await sheet.values.clear({ auth, spreadsheetId, range: "Sheet2!C:D" })
// const response = await sheet.values.update({ auth, spreadsheetId,range:"Sheet2!C:D",valueInputOption: "USER_ENTERED", requestBody: { "values": aoa } }).data;

// console.log(JSON.stringify(response, null, 2));
// console.log(readData.data)