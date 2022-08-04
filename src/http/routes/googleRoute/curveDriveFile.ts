import { Request, Response } from "express";
import { hasAnyPropertyUndefined } from "../../../lib/helperFunctions";
import { curveGrades, CurveMethods, CurveOptions } from "../../../services/curveGrades";
import { AssignmentDetails } from "../../../services/getAssignmentStatistics";
import { googleAuthorize } from "../../../services/googleAuthorization";
import {
  getSpreadsheetRows,
  isFormsSpreadsheet,
} from "../../../services/sheetsTools";
import { sendErrorFactory } from "../../errorResponses";

export type CurveDriveFileRequest = {
  assignmentDetails: AssignmentDetails;
  curveMethod: CurveMethods;
  curveOptions: CurveOptions;
};

export default async function curveDriveFile(req: Request, res: Response) {
  const sendError = sendErrorFactory(res, "GoogleError");

  const toCurve: CurveDriveFileRequest = {
    assignmentDetails: req.body.assignmentDetails,
    curveMethod: req.body.curveMethod,
    curveOptions: req.body.curveOptions,
  };

  if (hasAnyPropertyUndefined(toCurve)) {
    sendError("noInformation");
    return;
  }

  if (!req.user.googleToken) {
    sendError("noScopes");
    return;
  }

  try {
    const googleUser = await googleAuthorize(req.user.googleToken);

    const rows = await getSpreadsheetRows(
      toCurve.assignmentDetails.sheetsId,
      googleUser,
      "A1:C200"
    );

    if (!isFormsSpreadsheet(rows)) {
      sendError("notGoogleFormsSpreadsheet");
    }

    const curveResponse = await curveGrades(
      toCurve.curveMethod,
      toCurve.curveOptions,
      rows,
      toCurve.assignmentDetails,
      req.user.id
    );

    res.json(curveResponse);
  } catch (e) {
    console.log(e);

    sendError("unknownError");
  }
}
