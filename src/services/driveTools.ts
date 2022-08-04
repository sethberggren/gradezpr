import { OAuth2Client } from "googleapis-common"
import { google } from "googleapis";
import { DriveFile } from "../http/routes/googleRoute/getDriveFiles";

export async function searchDriveFiles(query: string, auth: OAuth2Client) {
    const drive = google.drive({ version: "v3", auth });
  
    let pageToken = undefined;
  
    const mimeType = "application/vnd.google-apps.spreadsheet";
  
    const res = await drive.files.list({
      q: `name contains '${query}' and mimeType='${mimeType}'`,
      fields: "nextPageToken, files(id, name)",
      spaces: "drive",
      pageToken: pageToken,
    });
  
    return res.data.files as DriveFile[];
  }