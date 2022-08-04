import { Request, Response } from "express";
import fileUpload from "express-fileupload";
import { Student } from "../../../models/Student";
import { User } from "../../../models/User";
import {
  isAllowableExcelType,
  parseExcelForStudentUpload,
  studentUploadExcelParseError,
} from "../../../services/excelTools";
import parseRosterSheetRows from "../../../services/parseRosterSheetRows";
import { sendErrorFactory } from "../../errorResponses";
import { StudentResponse } from "./studentsRoute";

export type RosterImportResponse = {
  numberOfInsertedStudents: number;
  duplicateStudents: string;
  students: StudentResponse[];
};

export default async function bulkUploadStudents(req: Request, res: Response) {
  const userId = req.user.id;
  const sendError = sendErrorFactory(res, "StudentError");

  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      sendError("noBulkFile");
      return;
    }

    const receivedFile = req.files.file as fileUpload.UploadedFile;

    if (!isAllowableExcelType(receivedFile)) {
      sendError("wrongFileType");
      return;
    }

    const rows = await parseExcelForStudentUpload(receivedFile);

    const { numberOfInsertedStudents, duplicateStudents } =
      await parseRosterSheetRows(rows, userId);

    // next, get students to attach to the response.

    const studentsToReturn = await Student.getStudentsWithCourses(req.user);

    const toReturn: RosterImportResponse = {
      numberOfInsertedStudents: numberOfInsertedStudents,
      duplicateStudents: duplicateStudents,
      students: studentsToReturn,
    };

    res.json(toReturn);
  } catch (error: any) {
    if (error.message === studentUploadExcelParseError) {
      sendError("didntUseTemplate");
      return;
    }

    console.log(error);
    sendError("unknownError");
  }
}
