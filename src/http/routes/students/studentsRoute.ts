import express from "express";
import { apiRoutes } from "../apiRoutes";
import bulkUploadStudents from "./bulkUploadStudents";
import deleteStudent from "./deleteStudent";
import postStudent from "./postStudent";
import putStudent from "./putStudent";

export type StudentResponse = {
  id: number;
  firstName: string;
  lastName: string;
  externalId: string;
  courses: string;
};

const students = express.Router();
students.use(express.json());

students.post(apiRoutes.students, postStudent);
students.put(apiRoutes.students, putStudent);
students.post(apiRoutes.bulkUploadStudents, bulkUploadStudents);
students.delete(apiRoutes.students, deleteStudent);

// students.get("/gradeupdater/students", async (req, res) => {
//   const sendError = sendErrorFactory(res, "StudentError");

//   const userId = req.user.id;

//   try {
//     const knex = User.knex();

//     const query = `SELECT stu.id as id, stu.firstName as firstName, stu.lastName as lastName, externalId, GROUP_CONCAT(subject ORDER BY subject ASC SEPARATOR ', ') as courses from studentsCourses as sc JOIN students as stu on (sc.studentId = stu.id) JOIN courses as crs on (sc.courseId = crs.id) JOIN users on (stu.userId = users.id) WHERE users.id = ? group by stu.id ORDER BY lastName`;

//     const toReturn = (await knex.raw(query, [userId])) as StudentResponse[];

//     returnDbResults(toReturn, res);
//   } catch (e) {
//     console.log(e);
//     sendError("unknownError");
//   }
// });

export default students;
