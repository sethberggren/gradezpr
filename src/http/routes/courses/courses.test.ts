import { verifyErrorsFactory } from "../../../../testingData/verifyErrorsFactory";
import { verifyApiResponseFactory } from "../../../../testingData/verifyApiResponseFactory";
import { populateDb, testCourses } from "../../../../testingData/populateDb";
import { Course } from "../../../models/Course";
import {v4 as uuid} from "uuid";
import { apiRoutes } from "../apiRoutes";
import { PostCourseRequest } from "./postCourse";


let userCourses : Course[];

const goodCourse = uuid();

const newCourse : PostCourseRequest = {
    subject: goodCourse
};

const newCourseResponse : PostCourseRequest & {id: number} = {
    subject: goodCourse,
    id: 0
};

let newCourseId : number;

const verifyPostRequest = verifyApiResponseFactory(apiRoutes.courses, "POST");
const verifyPostError = verifyErrorsFactory(apiRoutes.courses, "POST", "CourseError");

describe("courses endpoint", () => {

    beforeAll(async () => {
       await populateDb(false);
    });


    it("should be able to create a new course", async () => {
        const {id}= await verifyPostRequest(newCourse, {verifyOpt: "BODY", desiredResponse: newCourseResponse});

        newCourseId = id;
    });

    it("should respond with an error if the correct information is not sent over", async () => {
        await verifyPostError({}, "noInformation");

        await verifyPostError({badSubject: uuid()}, "noInformation");
    });

    it("should respond with an error if the user is trying to create a course that already exists", async () => {

        await verifyPostError({subject: goodCourse}, "alreadyExists");
    });

    it("should respond with an error if the correct information is not sent over when deleting", async () => {
        await verifyErrorsFactory(apiRoutes.courses, "DELETE", "CourseError")("noInformation");

        await verifyErrorsFactory(`${apiRoutes.courses}?id="Test"`, "DELETE", "CourseError")("noInformation");

        await verifyErrorsFactory(`${apiRoutes.courses}?badId=5`, "DELETE", "CourseError")("noInformation");
    });

    it("should be able to successfully delete the course that was just created", async () => {
        await verifyApiResponseFactory(`${apiRoutes.courses}?id=${newCourseId}`, "DELETE")({verifyOpt: "CODE"});
    });
});