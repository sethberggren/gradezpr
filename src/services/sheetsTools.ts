import { OAuth2Client } from "googleapis-common";
import { google } from "googleapis";

export function isFormsSpreadsheet(rows: string[][]): boolean {
  const formsFields = ["Timestamp", "Email Address", "Score"];

  return rows[0].every((value, index) => value === formsFields[index]);
}

export async function getSpreadsheetRows(
  spreadsheetId: string,
  auth: OAuth2Client,
  range: string
) {
  const sheets = google.sheets({ version: "v4", auth });

  const values = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: range,
  });

  const rows = values.data.values;

  if (rows === undefined) {
    throw new Error("Undefined spreadsheet rows");
  } else {
    return rows as any[][];
  }
}
