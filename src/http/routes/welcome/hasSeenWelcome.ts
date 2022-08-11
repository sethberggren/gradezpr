import { Request, Response } from "express";
import { User } from "../../../models/User";
import { sendErrorFactory } from "../../errorResponses";

export default async function hasSeenWelcome(req: Request, res: Response) {
  const user = req.user;

  const sendError = sendErrorFactory(res, "UnknownError");

  try {
    const updatedUser = await User.query().patchAndFetchById(user.id, {
      isNewUser: false,
    });

    res.status(200).send({ status: "OK" });
  } catch (error) {
    console.log(error);

    sendError("unknownError");
  }
}
