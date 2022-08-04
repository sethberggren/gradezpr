import { string } from "io-ts";
import {v4 as uuid} from "uuid";
import { apiRoutes } from "../src/http/routes/apiRoutes";
import { RegisterForm } from "../src/http/routes/authentication/authenticationRouter";
import { NewToken } from "../src/http/routes/authentication/generateToken";
import { AuthCredentials } from "./addtionalTestInformation";
import { verifyApiResponseFactory } from "./verifyApiResponseFactory";
import * as getGooglePayload from "../src/http/routes/authentication/getGooglePayload";

const goodPassword = uuid();

const newUser: RegisterForm = {
  firstName: uuid(),
  lastName: uuid(),
  email: `${uuid()}@gmail.com`,
  password: goodPassword,
  confirmedPassword: goodPassword,
};

const verifyApiRegister = verifyApiResponseFactory(apiRoutes.register, "POST");
const verifyApiDelete = verifyApiResponseFactory(
    apiRoutes.deleteUser,
    "DELETE",
    uuidCredentials()
  );

export async function createUuidUser() {
   const token = await verifyApiRegister<NewToken>(newUser, {verifyOpt: "CODE", httpCode: 201});
   return token;
}

export function uuidCredentials() {
    return {
        email: newUser.email,
        password: newUser.password
    }
};

export async function deleteUuidUser() {
    await verifyApiDelete({verifyOpt: "CODE"});
    return;
}

export async function deleteUser(credentials: AuthCredentials) {

  const verifyApiDelete = verifyApiResponseFactory(apiRoutes.deleteUser, "DELETE", credentials);

  await verifyApiDelete({verifyOpt: "CODE"});
  return;
};

const googleUser: RegisterForm = {
  firstName: uuid(),
  lastName: uuid(),
  email: `${uuid()}@gmail.com`,
  password: "GOOGLE LOGIN",
};

const goodRequest : getGooglePayload.GoogleClientRequest = {
  clientId: uuid(),
  credential: uuid(),
  select_by: uuid()
};

export async function createUuidGoogleUser() {

  const verifyApiGoogleRegister = verifyApiResponseFactory(apiRoutes.registerWithGoogle, "POST");

  const getGooglePayloadMock = jest
  .spyOn(getGooglePayload, "default")
  .mockImplementation(async () => {
    return {
      iss: uuid(),
      sub: uuid(),
      iat: 4,
      exp: 10,
      aud: uuid(),
      email: googleUser.email,
      given_name: googleUser.firstName,
      family_name: googleUser.lastName,
    };
  });

  await verifyApiGoogleRegister(goodRequest, {verifyOpt: "CODE"});
}

export function uuidGoogleCredentials() {
  return {
    email: googleUser.email,
    password: googleUser.password
  } as AuthCredentials;
};

export async function deleteUuidGoogleUser() {
  const verifyApiDelete = verifyApiResponseFactory(
    apiRoutes.deleteUser,
    "DELETE",
    uuidGoogleCredentials()
  );

  await verifyApiDelete({verifyOpt: "CODE"});
}