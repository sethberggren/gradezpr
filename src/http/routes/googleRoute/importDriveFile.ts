import { Request, Response } from "express";
import { hasAnyPropertyUndefined } from "../../../lib/helperFunctions";
import getAssignmentStatistics from "../../../services/getAssignmentStatistics";
import { googleAuthorize } from "../../../services/googleAuthorization";
import {
  getSpreadsheetRows,
  isFormsSpreadsheet,
} from "../../../services/sheetsTools";
import { sendErrorFactory } from "../../errorResponses";

export type ImportDriveFileRequest = {
  name: string;
  id: string;
  course: string;
};

export default async function importDriveFile(req: Request, res: Response) {
  const sendError = sendErrorFactory(res, "GoogleError");
  const toImport: ImportDriveFileRequest = {
    name: req.body.name,
    id: req.body.id,
    course: req.body.course,
  };

  if (hasAnyPropertyUndefined(toImport)) {
    sendError("noInformation");
    return;
  }

  if (!req.user.googleToken) {
    sendError("noScopes");
    return;
  }

  try {
    const googleUser = await googleAuthorize(req.user.googleToken);

    const rows = await getSpreadsheetRows(toImport.id, googleUser, "A1:C200");

    if (!isFormsSpreadsheet(rows)) {
      sendError("notGoogleFormsSpreadsheet");
      return;
    }

    const assignmentDetails = getAssignmentStatistics(
      rows,
      toImport.name,
      toImport.course,
      toImport.id
    );

    res.json(assignmentDetails);
  } catch (error) {
    console.log(error);
    sendError("unknownError");
  }
}
