import { Request, Response } from "express";
import { User } from "../../../models/User";
import { sendErrorFactory } from "../../errorResponses";

export default async function deleteStudent(req: Request, res: Response) {
  const sendError = sendErrorFactory(res, "StudentError");

  const userId = req.user.id;
  const idToDelete = req.query.id as string | undefined;

  if (idToDelete === undefined) {
    await User.relatedQuery("students").for(userId).delete();

    res.status(200).send({ status: "OK" });
    return;
  }

  try {
    await User.relatedQuery("students")
      .for(userId)
      .deleteById(parseInt(idToDelete));
    res.status(200).send({ status: "OK" });
  } catch (error) {
    console.log(error);

    sendError("unknownError");
  }
}
