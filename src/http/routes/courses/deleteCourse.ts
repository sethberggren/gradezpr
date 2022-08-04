import { Request, Response } from "express";
import { User } from "../../../models/User";
import { sendErrorFactory } from "../../errorResponses";

export default async function deleteCourse(req: Request, res: Response) {
  const sendError = sendErrorFactory(res, "CourseError");

  const id = req.user.id;
  const courseId = parseInt(req.query.id as string);

  if (isNaN(courseId)) {
    sendError("noInformation");
    return;
  }

  try {
    const deletedCourse = await User.relatedQuery("courses")
      .for(id)
      .deleteById(courseId);

    res.status(200).send({ status: "OK" });
  } catch (error) {
    console.log(error);
    sendError("unknownError");
    return;
  }
}
