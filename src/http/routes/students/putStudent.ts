import { Request, Response } from "express";
import Objection from "objection";
import { hasAnyPropertyUndefined, isEmptyObject } from "../../../lib/helperFunctions";
import { Student } from "../../../models/Student";
import { StudentsCourses } from "../../../models/StudentsCourses";
import { User } from "../../../models/User";
import { sendErrorFactory } from "../../errorResponses";
import { NewStudent, NewStudentRequest } from "./postStudent";
import { StudentResponse } from "./studentsRoute";

export type PutStudentRequest = { student: PutStudent };
export type PutStudent = NewStudent & { id: number };

export default async function putStudent(req: Request, res: Response) {
  const sendError = sendErrorFactory(res, "StudentError");

  if (req.body.student === undefined || isEmptyObject(req.body.student)) {
    sendError("noInformation");
    return;
  }

  const studentToEdit: PutStudent = {
    id: req.body.student.id,
    firstName: req.body.student.firstName,
    lastName: req.body.student.lastName,
    externalId: req.body.student.externalId,
    courses: req.body.student.courses,
  };

  const userId = req.user.id;

  if (!studentToEdit || hasAnyPropertyUndefined(studentToEdit)) {
    sendError("noInformation");
    return;
  }

  let editedStudentValidated: Objection.Pojo;

  try {
    editedStudentValidated = new Student().$validate({
      firstName: studentToEdit.firstName,
      lastName: studentToEdit.lastName,
      externalId: studentToEdit.externalId,
    });
  } catch (e) {
    sendError("noInformation");
    return;
  }

  try {
    const maybeStudent = (await User.relatedQuery("students")
      .for(userId)
      .select()
      .where({ id: studentToEdit.id })) as Student[];

    if (maybeStudent?.length === 0 || maybeStudent === undefined) {
      sendError("cannotEditDoesNotExist");
      return;
    }
    const editedStudent = await User.relatedQuery("students")
      .for(userId)
      .patchAndFetchById(studentToEdit.id, editedStudentValidated);

    // remove previous relationships.

    await StudentsCourses.query()
      .delete()
      .where({ studentId: studentToEdit.id });

    // add new relationships.

    const courses = studentToEdit.courses.split(",").map((val) => val.trim());

    for (const course of courses) {
      const courseRelation = await User.relatedQuery("courses")
        .for(userId)
        .where({ subject: course });

      if (courseRelation.length === 0) {
        sendError("courseNotCreated");
        return;
      }

      await editedStudent.$relatedQuery("courses").relate(courseRelation);
    }

    const toReturn = await Student.getStudentByExternalId(
      req.user,
      studentToEdit.externalId
    );

    res.json(toReturn);
  } catch (error) {
    console.log(error);
    sendError("unknownError");
  }
}
