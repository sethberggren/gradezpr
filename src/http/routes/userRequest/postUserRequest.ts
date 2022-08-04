import { Request, Response } from "express";
import Objection from "objection";
import { hasAnyPropertyUndefined } from "../../../lib/helperFunctions";
import { User } from "../../../models/User";
import { UserRequest } from "../../../models/UserRequest";
import { sendErrorFactory } from "../../errorResponses";

export const typeOfRequest = ["Bug", "Feature"] as const;

export type TypeOfRequest = typeof typeOfRequest[number];

export type UserRequestRequest = {
  typeOfRequest: TypeOfRequest;
  requestBody: string;
  shouldBeEmailed: boolean;
};

export default async function (req: Request, res: Response) {
  const sendError = sendErrorFactory(res, "UserRequestError");

  const user = req.user;

  console.log(req.body);

  const newUserRequest: UserRequestRequest = {
    typeOfRequest: req.body.typeOfRequest,
    requestBody: req.body.requestBody,
    shouldBeEmailed: req.body.shouldBeEmailed,
  };

  if (!req.body || hasAnyPropertyUndefined(newUserRequest)) {
    sendError("noInformation");
    return;
  }

  let newUserRequestValidated: Objection.Pojo;

  try {
    newUserRequestValidated = new UserRequest().$validate(newUserRequest);
  } catch (error) {
    sendError("noInformation");
    return;
  }

  try {
    await User.relatedQuery("userRequests")
      .for(user.id)
      .insert(newUserRequestValidated);

    res.json({ status: "OK" });
  } catch (error) {
    console.log(error);
    sendError("unknownError");
  }
}
