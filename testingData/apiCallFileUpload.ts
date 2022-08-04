import fs from "fs";
import { default as request } from "supertest";
import app from "../src/app";
import {
  ErrorSubtypes,
  ErrorTypes,
  getErrorFactory,
} from "../src/http/errorResponses";
import { tokenHeader } from "./addtionalTestInformation";
import { verifyErrorMessage } from "./verifyErrorsFactory";

type UploadFileDirectories = "rosterUpload" | "gradesheetUpload";

type UploadFile<K extends UploadFileDirectories> = K extends "rosterUpload"
  ? RosterUploadFiles
  : K extends "gradesheetUpload"
  ? GradesheetUploadFiles
  : never;

type UploadPaths<K extends UploadFileDirectories> = {
  [key in UploadFile<K>]: string;
};

type GradesheetUploadFiles =
  | "goodFile"
  | "badFileBlank"
  | "badFileHeadersNoData"
  | "badFileNoGrades"
  | "badFileNoId"
  | "badFileTypeCsv"
  | "badFileTypeXls"
  | "goodFileEarnedPoints"
  | "noFile";

const gradesheetUploadPaths: UploadPaths<"gradesheetUpload"> = {
  goodFile: __dirname + "/gradesheetUpload/goodGradesheet.xlsx",
  badFileBlank: __dirname + "/gradesheetUpload/badGradesheetBlank.xlsx",
  badFileHeadersNoData:
    __dirname + "/gradesheetUpload/gradesheetHeadersNoData.xlsx",
  badFileNoGrades: __dirname + "/gradesheetUpload/gradesheetNoGradeHeader.xlsx",
  badFileNoId: __dirname + "/gradesheetUpload/gradesheetNoIdColumn.xlsx",
  badFileTypeCsv: __dirname + "/gradesheetUpload/badFileType2.csv",
  badFileTypeXls: __dirname + "/gradesheetUpload/badFileType1.xls",
  goodFileEarnedPoints:
    __dirname + "/gradesheetUpload/goodGradesheetEarnedPointsTotalPoints.xlsx",
  noFile: "",
};

type RosterUploadFiles =
  | "badRosterBlank"
  | "goodRoster"
  | "badRosterHeaders"
  | "wrongFileExtension"
  | "badExcel"
  | "noFile";

const rosterUploadPaths: UploadPaths<"rosterUpload"> = {
  badRosterBlank: __dirname + "/rosterUploadFiles/badRosterBlank.xlsx",
  goodRoster: __dirname + "/rosterUploadFiles/goodRosterUpload.xlsx",
  badRosterHeaders: __dirname + "/rosterUploadFiles/badRosterHeaders.xlsx",
  wrongFileExtension: __dirname + "/rosterUploadFiles/badData.rtf",
  badExcel: __dirname + "/rosterUploadFiles/badExcel.xls",
  noFile: "",
};

type AllPaths = {
  [k in UploadFileDirectories]: UploadPaths<k>;
};

const allPaths: AllPaths = {
  rosterUpload: rosterUploadPaths,
  gradesheetUpload: gradesheetUploadPaths,
};

export function apiFileUploadFactory<K extends UploadFileDirectories>(
  route: string,
  fileDirectory: K
) {
  return async (file: UploadFile<K>, payload?: object) => {
    const filePath = allPaths[fileDirectory][file];

    const header = await tokenHeader();

    if (file === "noFile") {
      const response = await request(app)
        .post(route)
        .set(header)
        .expect("Content-Type", /json/);
      return response;
    }

    if (!fs.existsSync(filePath)) {
      throw new Error("File does not exist!");
    }

    let response: request.Response;

    if (payload) {
      response = await request(app)
        .post(route)
        .set(header)
        .attach("file", filePath)
        .field("body", JSON.stringify(payload))
        .expect("Content-Type", /json/);
    } else {
      response = await request(app)
        .post(route)
        .set(header)
        .attach("file", filePath)
        .expect("Content-Type", /json/);
    }

    return response;
  };
}

export function verifyFileUploadErrorFactory<
  K extends UploadFileDirectories,
  T extends ErrorTypes
>(route: string, fileDirectory: K, errorType: T) {
  return async (
    file: UploadFile<K>,
    errorBody: ErrorSubtypes<T>,
    payload?: object
  ) => {
    const header = await tokenHeader();

    if (file === "noFile") {
      const response = await request(app)
        .post(route)
        .set(header)
        .expect("Content-Type", /json/);

      verifyErrorMessage(getErrorFactory(errorType)(errorBody), response);
      return;
    }

    const filePath = allPaths[fileDirectory][file];

    if (!fs.existsSync(filePath)) {
      throw new Error("File does not exist!");
    }

    let response: request.Response;

    if (payload) {
      response = await request(app)
        .post(route)
        .set(header)
        .attach("file", filePath)
        .field("body", JSON.stringify(payload))
        .expect("Content-Type", /json/);
    } else {
      response = await request(app)
        .post(route)
        .set(header)
        .attach("file", filePath)
        .expect("Content-Type", /json/);
    }

    verifyErrorMessage(getErrorFactory(errorType)(errorBody), response);
  };
}
