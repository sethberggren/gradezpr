import express from "express";
import { initialize } from "objection";
import { Assignment } from "../../../models/Assignment";
import { Student } from "../../../models/Student";
import { User } from "../../../models/User";
import { AssignmentResponse } from "../../../services/curveGrades";
import { sendErrorFactory } from "../../errorResponses";
import { apiRoutes } from "../apiRoutes";
import { CourseResponse } from "../courses/postCourse";
import { StudentResponse } from "../students/studentsRoute";
import getAllCourses from "./getAllCourses";
import getUserInformation, { UserInformation } from "./getUserInformation";

export type InitializeResponse = {
  courses: CourseResponse[];
  students: StudentResponse[];
  assignments: AssignmentResponse[];
  userInformation: UserInformation;
};

const initalize = express.Router();
initalize.use(express.json());

initalize.get(apiRoutes.initialize, async (req, res) => {
  const user = req.user;

  const sendError = sendErrorFactory(res, "UnknownError");

  try {
    const courses = await getAllCourses(user);

    const students = await Student.getStudentsWithCourses(user);

    const assignments = await Assignment.getAssignmentsWithCourse(user);

    console.log(assignments);

    const userInformation = await getUserInformation(user);

    const toReturn: InitializeResponse = {
      courses: courses,
      students: students,
      assignments: assignments,
      userInformation: userInformation,
    };

    res.json(toReturn);
  } catch (e) {
    console.log(e);
    sendError("unknownError");
    return;
  }
});

export default initalize;
