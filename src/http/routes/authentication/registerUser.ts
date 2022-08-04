import { Request, Response } from "express";
import { isEmptyObject, isValidEmail } from "../../../lib/helperFunctions";
import { sendErrorFactory } from "../../errorResponses";
import authenticationRouter, { RegisterForm } from "./authenticationRouter";
import checkIfUserExists from "./checkIfUserExists";
import createUser from "./createUser";
import generateToken, { NewToken } from "./generateToken";

// type RegistrationResponseStatus =
//   | "OK"
//   | "Passwords Do Not Match"
//   | "Already Registered"
//   | "Unknown Error";

// type RegistrationResponse = {
//   status: RegistrationResponseStatus;
//   payload?: NewToken;
// };

// const registrationRespond = (
//   status: RegistrationResponseStatus,
//   token?: NewToken
// ): RegistrationResponse => {
//   switch (status) {
//     case "Already Registered": {
//       return {
//         status: "Already Registered",
//       };
//     }

//     case "OK": {
//       if (token) {
//         return token;
//       } else {
//         throw new Error("Must pass along token!");
//       }
//     }

//     case "Passwords Do Not Match": {
//       return {
//         status: "Passwords Do Not Match",

//       };
//     }

//     case "Unknown Error": {
//       return {
//         status: "Unknown Error",
//       };
//     }
//   }
// };

export default async function registerUser(req: Request, res: Response) {
  const sendError = sendErrorFactory(res, "RegistrationError");

  const newUser = req.body as RegisterForm | undefined;

  if (newUser && !isEmptyObject(newUser)) {
    if (newUser.confirmedPassword !== newUser.password) {
      sendError("passwordsDontMatch");
      return;
    }

    if (!isValidEmail(newUser.email)) {
      sendError("invalidEmail");
      return;
    }
    delete newUser.confirmedPassword;
  } else {
    sendError("noInformation");
    return;
  }
  try {
    // check if user already exits in database.

    const userExists = await checkIfUserExists(newUser.email);

    if (userExists === "Exists") {
      sendError("alreadyRegistered");
      return;
    }

    const createdUser = await createUser(newUser, undefined, undefined);

    const token = await generateToken(createdUser);

    res.status(201).json(token);
    return;
  } catch (error) {
    console.log(error);

    sendError("unknownError");
  }
}
