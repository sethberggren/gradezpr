import { Request, Response } from "express";
import { User } from "../../../models/User";
import { sendErrorFactory } from "../../errorResponses";

export default async function deleteAssignment(req: Request, res: Response) {
  const sendError = sendErrorFactory(res, "AssignmentError");
  try {
    const assignmentId = parseInt(req.query.assignmentId as string);

    if (isNaN(assignmentId)) {
      sendError("noInformation");
      return;
    }

    await User.relatedQuery("assignments")
      .for(req.user.id)
      .deleteById(assignmentId);

    res.status(200).send({ status: "OK" });
  } catch (e) {
    console.log(e);
    sendError("unknownError");
  }
}
