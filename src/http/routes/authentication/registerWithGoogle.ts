import { Request, Response } from "express";
import { sendErrorFactory } from "../../errorResponses";
import { RegisterForm } from "./authenticationRouter";
import checkIfUserExists from "./checkIfUserExists";
import createUser from "./createUser";
import generateToken, { NewToken } from "./generateToken";
import getGooglePayload, { GoogleClientRequest } from "./getGooglePayload";

export const googleDefaultPassword = "GOOGLE LOGIN" as const;
  

export default async function registerWithGoogle(req: Request, res: Response) {

    const sendError = sendErrorFactory(res, "RegistrationError");

    const googleRequest = req.body as GoogleClientRequest;

    if (!googleRequest.clientId || !googleRequest.credential || !googleRequest.select_by) {
      sendError("noInformation");
      return;
    }

    try {
      const payload = await getGooglePayload(googleRequest);
  
      if (payload) {
        const newUser: RegisterForm = {
          firstName: payload.given_name as string,
          lastName: payload.family_name as string,
          email: payload.email as string,
          password: googleDefaultPassword,
        };
  
        const alreadyExists = await checkIfUserExists(newUser.email);
  
        if (alreadyExists === "Exists") {
          sendError("alreadyRegistered");
        } else {
          const createdUser = await createUser(newUser,true, undefined);
    
          const token = await generateToken(createdUser);
          
          res.send(token);
        }
      } else {
        sendError("noInformation");
        return;
      }
    } catch (error) {
      console.log(error);
      sendError("unknownError");
    }
}