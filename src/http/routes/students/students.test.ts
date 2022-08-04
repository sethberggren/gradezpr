import { populateDb } from "../../../../testingData/populateDb";
import { v4 as uuid } from "uuid";
import {
  StudentResponse,
} from "./studentsRoute";
import {
  randomTestCoursesString,
} from "../../../../testingData/addtionalTestInformation";
import { verifyApiResponseFactory } from "../../../../testingData/verifyApiResponseFactory";
import { verifyErrorsFactory } from "../../../../testingData/verifyErrorsFactory";
import {
  apiFileUploadFactory,
  verifyFileUploadErrorFactory,
} from "../../../../testingData/apiCallFileUpload";
import { apiRoutes } from "../apiRoutes";
import { NewStudentRequest } from "./postStudent";
import { PutStudentRequest } from "./putStudent";

// TO-DO: test route for bulk upload of students...

const goodFirstName = uuid();
const goodLastName = uuid();
const goodExternalId = uuid();
const goodCourses = randomTestCoursesString();

const goodNewStudent: NewStudentRequest = {
  student: {
    firstName: goodFirstName,
    lastName: goodLastName,
    externalId: goodExternalId,
    courses: goodCourses,
  },
};

const goodNewStudentExpectedResponse: StudentResponse = {
  id: 0,
  firstName: goodFirstName,
  lastName: goodLastName,
  externalId: goodExternalId,
  courses: goodCourses,
};

let goodStudentDbId: number;

const verifyApiStudentPost = verifyApiResponseFactory(
  apiRoutes.students,
  "POST"
);

const verifyApiStudentPut = verifyApiResponseFactory(apiRoutes.students, "PUT");

const verifyErrorsPost = verifyErrorsFactory(
  apiRoutes.students,
  "POST",
  "StudentError"
);

const verifyErrorsPut = verifyErrorsFactory(
  apiRoutes.students,
  "PUT",
  "StudentError"
);

const apiFileUpload = apiFileUploadFactory(
  apiRoutes.bulkUploadStudents,
  "rosterUpload"
);
const verifyFileUploadError = verifyFileUploadErrorFactory(
  apiRoutes.bulkUploadStudents,
  "rosterUpload",
  "StudentError"
);

describe("student endpoint", () => {
  beforeAll(async () => {
    await populateDb(false);
  });

  it("should be able to create a new student", async () => {
    const { id } = await verifyApiStudentPost(goodNewStudent, {
      verifyOpt: "BODY",
      desiredResponse: goodNewStudentExpectedResponse,
    });

    goodStudentDbId = id;
  });

  it("should respond with an error if a request field is forgotten or blank", async () => {
    await verifyErrorsPost({}, "noInformation");

    const missingField = {
      student: {
        firstName: goodFirstName,
        lastName: goodLastName,
        courses: goodCourses,
      },
    };

    await verifyErrorsPost(missingField, "noInformation");
  });

  it("should respond with an error if the user is trying to enter a duplicate student", async () => {
    await verifyErrorsPost(goodNewStudent, "noDuplicateStudents");
  });

  it("should respond with an error if the user includes a course that does not already exist", async () => {
    const courseDoesNotExist: NewStudentRequest = {
      student: {
        firstName: goodFirstName,
        lastName: goodLastName,
        externalId: uuid(),
        courses: uuid(),
      },
    };

    await verifyErrorsPost(courseDoesNotExist, "courseNotCreated");
  });

  it("should be able to edit the student just created", async () => {
    const editedStudent: PutStudentRequest = {
      student: {
        id: goodStudentDbId,
        firstName: goodFirstName,
        lastName: uuid(),
        courses: goodCourses,
        externalId: goodExternalId,
      },
    };

    await verifyApiStudentPut(editedStudent, {
      verifyOpt: "BODY",
      desiredResponse: editedStudent.student,
    });
  });

  it("should respond with an error if a request field is forgotten or blank", async () => {
    await verifyErrorsPut({}, "noInformation");

    const missingField = {
      student: {
        firstName: goodFirstName,
        lastName: goodLastName,
        courses: goodCourses,
      },
    };

    await verifyErrorsPut(missingField, "noInformation");
  });

  it("should respond with an error if the user is trying to edit a student that does not exist", async () => {
    const thisStudentDoesNotExist: PutStudentRequest = {
      student: {
        id: 0,
        firstName: uuid(),
        lastName: uuid(),
        courses: goodCourses,
        externalId: uuid(),
      },
    };

    await verifyErrorsPut(thisStudentDoesNotExist, "cannotEditDoesNotExist");
  });

  it("should respond with an error if the user is trying to edit a student including a course that does not exist", async () => {
    const courseDoesNotExist: PutStudentRequest = {
      student: {
        id: goodStudentDbId,
        firstName: goodFirstName,
        lastName: goodLastName,
        externalId: goodExternalId,
        courses: uuid(),
      },
    };

    await verifyErrorsPut(courseDoesNotExist, "courseNotCreated");
  });

  it("should be able to delete the student just created", async () => {
    const verifyApiStudentDelete = verifyApiResponseFactory(
      `${apiRoutes.students}?id=${goodStudentDbId}`,
      "DELETE"
    );
    await verifyApiStudentDelete({ verifyOpt: "CODE" });
  });

  it("should be able to bulk upload students", async () => {
    // const filePath = __dirname +  "/../../../testData/rosterUploadFiles/goodRosterUpload.xlsx";

    // if (!fs.existsSync(filePath)) {
    //   throw new Error("File does not exist.");
    // }

    // const header = await tokenHeader();
    // const response = await request(app).post(apiRoutes.bulkUploadStudents).set(header).attach("file", filePath).expect("Content-Type", /json/);

    const response = await apiFileUpload("goodRoster");

    expect(response.statusCode).toBe(200);

    const data = response.body;
    expect(data).toHaveProperty("numberOfInsertedStudents");
    expect(data).toHaveProperty("duplicateStudents");
    expect(data).toHaveProperty("students");

    expect(data.numberOfInsertedStudents).toBeGreaterThan(0);

    const students = response.body.students as StudentResponse[];

    const newStudentFirstNames = ["Ahsoka", "Ki-Adi", "Aayla"];

    for (const newStudentFirstName of newStudentFirstNames) {
      expect(
        students.find((student) => student.firstName === newStudentFirstName)
      ).not.toBeUndefined;
    }
  });

  it("should return an error if a blank Excel spreadsheet is uploaded", async () => {
    await verifyFileUploadError("badRosterBlank", "didntUseTemplate");
  });

  it("should return an error if uploaded Excel spreadsheet has the wrong headers", async () => {
    await verifyFileUploadError("badRosterHeaders", "didntUseTemplate");
  });

  it("should return an error if did not upload a .xlsx file", async () => {
    await verifyFileUploadError("wrongFileExtension", "wrongFileType");
    await verifyFileUploadError("badExcel", "wrongFileType");
  });

  it("should delete all students", async () => {
    await verifyApiResponseFactory(
      apiRoutes.students,
      "DELETE"
    )({ verifyOpt: "CODE" });
  });
});
