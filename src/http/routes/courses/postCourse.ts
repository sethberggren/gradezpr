import {Request, Response} from "express";
import Objection from "objection";
import { hasAnyPropertyUndefined } from "../../../lib/helperFunctions";
import { Course } from "../../../models/Course";
import { User } from "../../../models/User";
import { sendErrorFactory } from "../../errorResponses";

export type CourseResponse = { 
    id: number;
    subject: string
  };
  
  export type PostCourseRequest = {
    subject: string
  };

export default async function postCourse(req: Request, res: Response){
    const sendError = sendErrorFactory(res, "CourseError");

  const id = req.user.id;

  const courseToInsert : PostCourseRequest = {
    subject: req.body.subject,
  }

  if (courseToInsert === undefined || hasAnyPropertyUndefined(courseToInsert)) {
    sendError("noInformation");
    return;
  };

  let validatedCourse : Objection.Pojo;

  try {
    validatedCourse = new Course().$validate(courseToInsert);
  } catch (e) {
    sendError("noInformation");
    return;
  }

  try {
    //insert course and relate it to the current user;

    const maybeCourse = await User.relatedQuery("courses")
      .for(id)
      .where(courseToInsert);

    if (maybeCourse.length > 0) {
      sendError("alreadyExists");
      return;
    }

    const createdCourse = await User.relatedQuery("courses")
      .for(id)
      .insertAndFetch(validatedCourse) as Course;

    const toReturn : CourseResponse = {
      id: createdCourse.id,
      subject: createdCourse.subject
    };

    res.json(toReturn);
    return;
  } catch (error) {
    console.log(error);
    sendError("unknownError");
    return;
  }
}