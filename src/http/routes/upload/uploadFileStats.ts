import { Request, Response } from "express";
import fileUpload from "express-fileupload";
import {
  isEmptyObject,
} from "../../../lib/helperFunctions";
import {
  parseExcelForGrades,
  badDataError,
  isAllowableExcelType,
} from "../../../services/excelTools";
import getAssignmentStatistics from "../../../services/getAssignmentStatistics";
import { sendErrorFactory } from "../../errorResponses";

export type UploadFileDetails = {
  subject: string
};

export type UploadFileRequest = {
  body: {
    subject: string;
  };
};

export default async function uploadFileStats(req: Request, res: Response) {
  const sendError = sendErrorFactory(res, "UploadError");

  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      sendError("wrongFileType");
      return;
    }

    if (isEmptyObject(req.body) || req.body.body === undefined) {
      sendError("invalidInformation");
      return;
    }

    const { subject } = JSON.parse(req.body.body) as {
      subject: string | undefined;
    };

    const received = req.files.file as fileUpload.UploadedFile;

    if (!subject) {
      sendError("invalidInformation");
      return;
    }

    if (!isAllowableExcelType(received)) {
      sendError("wrongFileType");
      return;
    }

    const { rows, rawGradeCalculated } = await parseExcelForGrades(received);

    const assignmentStats = getAssignmentStatistics(
      rows,
      received.name,
      subject,
      "File Upload",
      rawGradeCalculated
    );

    res.json(assignmentStats);
  } catch (error: any) {
    if (error.message === badDataError) {
      sendError("badData");
      return;
    }

    console.log(error);
    sendError("unknownError");
    return;
  }
}
