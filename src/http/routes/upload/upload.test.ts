
import { apiRoutes } from "../apiRoutes";
import {populateDb, testCourses} from "../../../../testingData/populateDb";
import {apiFileUploadFactory, verifyFileUploadErrorFactory } from "../../../../testingData/apiCallFileUpload";
import { AssignmentResponse } from "../../../services/curveGrades";
import { AssignmentDetails } from "../../../services/getAssignmentStatistics";
import { compareObjects } from "../../../../testingData/addtionalTestInformation";
import { verifyErrorsFactory } from "../../../../testingData/verifyErrorsFactory";
import {verifyApiResponseFactory} from "../../../../testingData/verifyApiResponseFactory";
import { FileCurveDetails, FileCurveRequest } from "./uploadFileCurve";


const goodCourse = testCourses[0];

const apiFileUploadStats = apiFileUploadFactory(
  apiRoutes.uploadFileStats,
  "gradesheetUpload"
);
const apiFileUploadCurve = apiFileUploadFactory(
  apiRoutes.uploadFileCurve,
  "gradesheetUpload"
);

const verifyErrorsStats = verifyFileUploadErrorFactory(
  apiRoutes.uploadFileStats,
  "gradesheetUpload",
  "UploadError"
);
const verifyErrorsCurve = verifyFileUploadErrorFactory(
  apiRoutes.uploadFileCurve,
  "gradesheetUpload",
  "UploadError"
);

const desiredAssignmentDetails = {
  assignmentName: "goodGradesheet.xlsx",
  courseName: "Mastering the Force",
  totalPoints: 100,
  highestScore: 100,
  mean: 78.6,
  median: 88,
  lowestScore: 40,
  secondHighestScore: 90,
  std: 20.87678136111982,
  sheetsId: "File Upload",
};

const desiredAssignmentDetailsNoRawGrade = {
  assignmentName: "goodGradesheetEarnedPointsTotalPoints.xlsx",
  courseName: "Mastering the Force",
  totalPoints: 8,
  highestScore: 100,
  mean: 67.5,
  median: 75,
  lowestScore: 12.5,
  secondHighestScore: 75,
  std: 33.166247903554,
  sheetsId: "File Upload",
};

const goodFileCurveRequest: FileCurveDetails = {
  assignmentDetails: desiredAssignmentDetails,
  curveMethod: "linear",
  curveOptions: {
    mean: 0,
    std: 0,
    min: 50,
    max: 100,
  },
};

const goodFileCurveRequestNoRawGrade: FileCurveDetails = {
  assignmentDetails: desiredAssignmentDetailsNoRawGrade,
  curveMethod: "mstd",
  curveOptions: {
    mean: 70,
    std: 10,
    min: 0,
    max: 0,
  },
};

const goodFileCurveResponse: AssignmentResponse = {
  id: 183,
  name: "goodGradesheet.xlsx",
  lastUpdated: "2022-06-28T17:28:18.000Z",
  curveMethod: "linear",
  allGradesString:
    "Padme Amidala\t100\rBail Organa\t79.16666666666666\rObi-Wan Kenobi\t91.66666666666667\rMace Windu\t50\rShaak Ti\t90\r",
  course: "Mastering the Force",
};

const goodFileCurveResponseNoRawGrade: AssignmentResponse = {
  id: 188,
  name: "goodGradesheetEarnedPointsTotalPoints.xlsx",
  lastUpdated: "2022-06-28T17:39:40.000Z",
  curveMethod: "mstd",
  allGradesString:
    "Padme Amidala\t79.79911869877732\rBail Organa\t72.26133508433323\rObi-Wan Kenobi\t64.72355146988913\rMace Windu\t79.79911869877732\rShaak Ti\t53.416876048223\r",
  course: "Mastering the Force",
};

let assignmentDetails: AssignmentDetails;

describe("import assignment with file upload", () => {
  beforeAll(async () => {
    await populateDb(false);
  });

  it("should be able to upload a file and get assignment statistics", async () => {
    const response = await apiFileUploadStats("goodFile", goodCourse);

    expect(response.statusCode).toBe(200);

    compareObjects(response.body, desiredAssignmentDetails);

    assignmentDetails = response.body;
  });

  it("should  be able to upload a file where the raw grade is not calculated", async () => {
    const response = await apiFileUploadStats(
      "goodFileEarnedPoints",
      goodCourse
    );

    expect(response.statusCode).toBe(200);

    compareObjects(response.body, desiredAssignmentDetailsNoRawGrade);
  });

  it("should return an error if no file is sent over", async () => {
    await verifyErrorsStats("noFile", "wrongFileType", goodCourse);
  });

  it("should return an error if course is not send over", async () => {
    await verifyErrorsStats("goodFile", "invalidInformation");
  });

  it("should return an error if file is not an Excel file", async () => {
    await verifyErrorsStats("badFileTypeCsv", "wrongFileType", goodCourse);
    await verifyErrorsStats("badFileTypeXls", "wrongFileType", goodCourse);
  });

  it("should return an error if the user does not include an id column", async () => {
    await verifyErrorsStats("badFileNoId", "badData", goodCourse);
  });

  it("should return an error if the user does not include a grades column", async () => {
    await verifyErrorsStats("badFileNoGrades", "badData", goodCourse);
  });

  it("should return an error if the user uploads a blank file", async () => {
    await verifyErrorsStats("badFileBlank", "badData", goodCourse);
  });

  it("should return an error if the spreadsheet includes the correct columns, but no grades", async () => {
    await verifyErrorsStats("badFileHeadersNoData", "badData", goodCourse);
  });

  it("should be able to upload a file and import the file with a curve", async () => {
    const response = await apiFileUploadCurve("goodFile", goodFileCurveRequest);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("lastUpdated");

    goodFileCurveResponse.id = response.body.id;
    goodFileCurveResponse.lastUpdated = response.body.lastUpdated;

    compareObjects(response.body, goodFileCurveResponse);
  });

  it("should be able to upload a file where the raw grade is not calculated", async () => {
    const response = await apiFileUploadCurve(
      "goodFileEarnedPoints",
      goodFileCurveRequestNoRawGrade
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("lastUpdated");

    goodFileCurveResponseNoRawGrade.lastUpdated = response.body.lastUpdated;
    goodFileCurveResponseNoRawGrade.id = response.body.id;

    compareObjects(response.body, goodFileCurveResponseNoRawGrade);
  });

  it("should return an error if no file is sent over", async () => {
    await verifyErrorsCurve("noFile", "wrongFileType", goodFileCurveRequest);
  });

  it("should return an error if the wrong body payload is sent over", async () => {
    await verifyErrorsCurve("goodFile", "invalidInformation", {});

    await verifyErrorsCurve("goodFile", "invalidInformation", {
      assignmentDetails: assignmentDetails,
      crvMthd: "mstd",
      curveOptions: goodFileCurveRequest.curveOptions,
    });
  });

  it("should return an error if file is not an Excel file", async () => {
    await verifyErrorsCurve(
      "badFileTypeCsv",
      "wrongFileType",
      goodFileCurveRequest
    );
    await verifyErrorsCurve(
      "badFileTypeXls",
      "wrongFileType",
      goodFileCurveRequest
    );
  });

  it("should return an error if the user does not include an id column", async () => {
    await verifyErrorsCurve("badFileNoId", "badData", goodFileCurveRequest);
  });

  it("should return an error if the user does not include a grades column", async () => {
    await verifyErrorsCurve("badFileNoGrades", "badData", goodFileCurveRequest);
  });

  it("should return an error if the user uploads a blank file", async () => {
    await verifyErrorsCurve("badFileBlank", "badData", goodFileCurveRequest);
  });

  it("should return an error if the spreadsheet includes the correct columns, but no grades", async () => {
    await verifyErrorsCurve(
      "badFileHeadersNoData",
      "badData",
      goodFileCurveRequest
    );
  });

  it("should be able to delete the two assignments just created", async () => {
    await verifyApiResponseFactory(`${apiRoutes.assignments}?assignmentId=${goodFileCurveResponse.id}`, "DELETE")({verifyOpt: "CODE"});
    await verifyApiResponseFactory(`${apiRoutes.assignments}?assignmentId=${goodFileCurveResponseNoRawGrade.id}`, "DELETE")({verifyOpt: "CODE"});
  });

  it("should return an error if no assignment id is passed through when deleting assignment", async () => {
    await verifyErrorsFactory(apiRoutes.assignments, "DELETE", "AssignmentError")("noInformation");
    await verifyErrorsFactory(`${apiRoutes.assignments}?asignmentId=${goodFileCurveResponse.id}`, "DELETE", "AssignmentError")("noInformation");
  })
});
