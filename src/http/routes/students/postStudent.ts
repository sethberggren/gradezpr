import { Request, Response } from "express";
import Objection from "objection";
import { hasAnyPropertyUndefined, isEmptyObject } from "../../../lib/helperFunctions";
import { Student } from "../../../models/Student";
import { User } from "../../../models/User";
import { sendErrorFactory } from "../../errorResponses";
import { StudentResponse } from "./studentsRoute";

export type NewStudentRequest = {student: NewStudent}

export type NewStudent = {
  firstName: string;
  lastName: string;
  externalId: string;
  courses: string;
};

export default async function postStudent(req: Request, res: Response) {
  const sendError = sendErrorFactory(res, "StudentError");

  if (req.body.student === undefined || isEmptyObject(req.body.student)) {
    sendError("noInformation");
    return;
  }

  const studentToInsert: NewStudent = {
    firstName: req.body.student.firstName,
    lastName: req.body.student.lastName,
    externalId: req.body.student.externalId,
    courses: req.body.student.courses,
  };

  const userId = req.user.id;

  if (
    studentToInsert === undefined ||
    hasAnyPropertyUndefined(studentToInsert)
  ) {
    sendError("noInformation");
    return;
  }

  let studentValidated: Objection.Pojo;

  try {
    studentValidated = new Student().$validate({
      firstName: studentToInsert.firstName,
      lastName: studentToInsert.lastName,
      externalId: studentToInsert.externalId,
    });
  } catch (error) {
    sendError("noInformation");
    return;
  }

  try {
    // check if student already is in database.
    const knex = User.knex();

    const maybeStudent = await User.relatedQuery("students")
      .for(userId)
      .where({ externalId: studentToInsert.externalId });

    if (maybeStudent.length > 0) {
      sendError("noDuplicateStudents");
      return;
    }

    const createdStudent = (await User.relatedQuery("students")
      .for(userId)
      .insertAndFetch(studentValidated)) as Student;

    const courses = studentToInsert.courses.split(",").map((val) => val.trim());

    for (const course of courses) {
      const section = await User.relatedQuery("courses")
        .for(userId)
        .where({ subject: course });

      if (section.length === 0) {
        await User.relatedQuery("students").deleteById(createdStudent.id);
        sendError("courseNotCreated");
        return;
      }

      await createdStudent.$relatedQuery("courses").relate(section);
    }

    const toReturn = await Student.getStudentByExternalId(
      req.user,
      createdStudent.externalId
    );

    res.json(toReturn);
  } catch (error) {
    console.log(error);
    sendError("unknownError");
  }
}
