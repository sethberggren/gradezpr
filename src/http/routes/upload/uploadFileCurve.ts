import { Request, Response } from "express";
import fileUpload from "express-fileupload";
import {
  hasAnyPropertyUndefined,
} from "../../../lib/helperFunctions";
import { curveGrades, CurveMethods, CurveOptions } from "../../../services/curveGrades";
import {
  parseExcelForGrades,
  badDataError,
  isAllowableExcelType,
} from "../../../services/excelTools";
import { AssignmentDetails } from "../../../services/getAssignmentStatistics";
import { sendErrorFactory } from "../../errorResponses";

export type FileCurveDetails = {
  assignmentDetails: AssignmentDetails;
  curveMethod: CurveMethods;
  curveOptions: CurveOptions;
};

export type FileCurveRequest = {
  body: FileCurveDetails;
};

export default async function uploadFileCurve(req: Request, res: Response) {
  const sendError = sendErrorFactory(res, "UploadError");
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      sendError("wrongFileType");
      return;
    }

    const userId = req.user.id;
    const received = req.files.file as fileUpload.UploadedFile;

    if (!isAllowableExcelType(received)) {
      sendError("wrongFileType");
      return;
    }

    if (req.body.body === undefined) {
      sendError("invalidInformation");
      return;
    }

    const possiblyFileCurveDetails = JSON.parse(req.body.body);

    const fileCurveDetails: FileCurveDetails = {
      assignmentDetails: possiblyFileCurveDetails.assignmentDetails,
      curveOptions: possiblyFileCurveDetails.curveOptions,
      curveMethod: possiblyFileCurveDetails.curveMethod,
    };

    if (hasAnyPropertyUndefined(fileCurveDetails)) {
      sendError("invalidInformation");
      return;
    }

    const { rows, rawGradeCalculated } = await parseExcelForGrades(received);

    const importedGrades = await curveGrades(
      fileCurveDetails.curveMethod,
      fileCurveDetails.curveOptions,
      rows,
      fileCurveDetails.assignmentDetails,
      userId,
      rawGradeCalculated
    );

    res.json(importedGrades);
  } catch (error: any) {
    if (error.message === badDataError) {
      sendError("badData");
      return;
    }
    console.log(error);
    sendError("unknownError");
  }
}
