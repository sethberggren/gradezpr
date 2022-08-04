import { populateDb, testCourses } from "../../../../testingData/populateDb";
import * as googleAuthorize from "../../../services/GoogleAuthorization";
import * as getDriveFiles from "../../../services/DriveTools";
import * as sheetsTools from "../../../services/SheetsTools";
import { OAuth2Client, OAuth2ClientOptions } from "google-auth-library";
import { verifyApiResponseFactory } from "../../../../testingData/verifyApiResponseFactory";
import { verifyErrorsFactory } from "../../../../testingData/verifyErrorsFactory";
import { apiRoutes } from "../apiRoutes";
import {
  uuidCredentials,
  createUuidUser,
  deleteUuidUser,
} from "../../../../testingData/userTools";
import { v4 as uuid } from "uuid";
import { result } from "lodash";
import { ImportDriveFileRequest } from "./importDriveFile";
import { CurveDriveFileRequest } from "./curveDriveFile";

const googleDriveSearchMockedResponse = [
  {
    id: "14vsMpR_vSI6_vvD5NPjRehIhz3a4iRB7-DZC8GA4nqE",
    name: "Untitled form (Responses)",
  },
  {
    id: "1uSMz4-o8PIvi9cVGf5lFHWVEmUpUMhuEAfgckZ5M8ZA",
    name: "Untitled spreadsheet",
  },
];

const googleDriveSheetsMockedRows = [
  ["Timestamp", "Email Address", "Score"],
  ["7/7/2022 15:35:10", "1@coruscant.org", "1 / 1"],
  ["7/7/2022 15:35:16", "2@coruscant.org", "1 / 1"],
  ["7/7/2022 15:35:27", "3@coruscant.org", "1 / 1"],
];

const googleDriveSheetsAssignmentDetails = {
  assignmentName: "Untitled form ",
  courseName: testCourses[0].subject,
  totalPoints: 1,
  highestScore: 100,
  mean: 100,
  median: 100,
  lowestScore: 100,
  secondHighestScore: 100,
  std: 0,
  sheetsId: "14vsMpR_vSI6_vvD5NPjRehIhz3a4iRB7-DZC8GA4nqE",
};

const importRequest: ImportDriveFileRequest = {
  name: uuid(),
  id: uuid(),
  course: testCourses[0].subject,
};

const curveRequest: CurveDriveFileRequest = {
  assignmentDetails: googleDriveSheetsAssignmentDetails,
  curveMethod: "none",
  curveOptions: {
    max: 0,
    min: 0,
    mean: 0,
    std: 0,
  },
};

const googleAuthorizeMock = jest.spyOn(googleAuthorize, "googleAuthorize");
const searchDriveFilesMock = jest.spyOn(getDriveFiles, "searchDriveFiles");
const getSpreadsheetRowsMock = jest.spyOn(sheetsTools, "getSpreadsheetRows");

describe("Google route test", () => {
  beforeAll(async () => {
    await populateDb(false);
    await createUuidUser();
  });

  beforeEach(() => {
    googleAuthorizeMock.mockReset();
    googleAuthorizeMock.mockImplementation(
      async () => new OAuth2Client() as any
    );

    searchDriveFilesMock.mockReset();
    searchDriveFilesMock.mockImplementation(
      async () => googleDriveSearchMockedResponse
    );

    getSpreadsheetRowsMock.mockReset();
    getSpreadsheetRowsMock.mockImplementation(
      async () => googleDriveSheetsMockedRows
    );
  });

  afterAll(async () => {
    deleteUuidUser();
  });

  it("should return the files correctly", async () => {
    await verifyApiResponseFactory(
      `${apiRoutes.getDriveFiles}?fileName=untitled`,
      "GET"
    )({ verifyOpt: "TYPE", desiredResponse: googleDriveSearchMockedResponse });
    expect(googleAuthorizeMock).toHaveBeenCalledTimes(1);
    expect(searchDriveFilesMock).toHaveBeenCalledTimes(1);
  });

  it("should return an error if no file name is passed over", async () => {
    await verifyErrorsFactory(
      apiRoutes.getDriveFiles,
      "GET",
      "GoogleError"
    )("noInformation");
    expect(googleAuthorizeMock).toHaveBeenCalledTimes(0);
  });

  it("should return an error if the user has not granted additional scopes with google", async () => {
    await verifyErrorsFactory(
      `${apiRoutes.getDriveFiles}?fileName=untitled`,
      "GET",
      "GoogleError",
      uuidCredentials()
    )("noScopes");
    expect(googleAuthorizeMock).toHaveBeenCalledTimes(0);
  });

  it("should return the assignment details correctly", async () => {
    await verifyApiResponseFactory(apiRoutes.importDriveFile, "POST")(
      importRequest,
      { verifyOpt: "TYPE", desiredResponse: googleDriveSheetsAssignmentDetails }
    );
  });

  it("should return an error if the request includes missing or incorrect fields", async () => {
    const verifyErrors = verifyErrorsFactory(
      apiRoutes.importDriveFile,
      "POST",
      "GoogleError"
    );

    await verifyErrors({}, "noInformation");
    await verifyErrors(
      { nome: uuid(), id: uuid(), course: testCourses[0].subject },
      "noInformation"
    );
  });

  it("should return an error if the user has not granted additional scopes with google", async () => {
    await verifyErrorsFactory(
      apiRoutes.importDriveFile,
      "POST",
      "GoogleError",
      uuidCredentials()
    )(importRequest, "noScopes");
  });

  it("should return an error if the spreadsheet selected is not a Google forms sheet", async () => {
    getSpreadsheetRowsMock.mockImplementation(async () => [
      ["7/7/2022 15:35:10", "1@coruscant.org", "1 / 1"],
      ["7/7/2022 15:35:16", "2@coruscant.org", "1 / 1"],
      ["7/7/2022 15:35:27", "3@coruscant.org", "1 / 1"],
    ]);

    await verifyErrorsFactory(
      apiRoutes.importDriveFile,
      "POST",
      "GoogleError"
    )(importRequest, "notGoogleFormsSpreadsheet");
  });

  it("should be able to curve the sheets assignment correctly", async () => {
    const results = await verifyApiResponseFactory(
      apiRoutes.curveDriveFile,
      "POST"
    )(curveRequest, { verifyOpt: "CODE" });

    console.log(results);
  });

  it("should return an error if the request includes missing or incorrect fields", async () => {
    const verifyErrors = verifyErrorsFactory(
      apiRoutes.curveDriveFile,
      "POST",
      "GoogleError"
    );

    await verifyErrors({}, "noInformation");
    await verifyErrors(
      {
        assingmentDetails: curveRequest.assignmentDetails,
        curveMethod: curveRequest.curveMethod,
        curveOptions: curveRequest.curveOptions,
      },
      "noInformation"
    );
  });

  it("should return an error if the user has not granted additional scopes with google", async () => {
    await verifyErrorsFactory(
      apiRoutes.curveDriveFile,
      "POST",
      "GoogleError",
      uuidCredentials()
    )(curveRequest, "noScopes");
  });
});
