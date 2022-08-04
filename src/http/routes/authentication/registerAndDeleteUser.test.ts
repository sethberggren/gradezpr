import { default as request } from "supertest";
import { RegisterForm } from "./authenticationRouter";
import { v4 as uuid } from "uuid";
import app from "../../../app";
import { apiRoutes } from "../apiRoutes";
import {
  testLogin,
  tokenHeader,
} from "../../../../testingData/addtionalTestInformation";
import { getErrorFactory } from "../../errorResponses";
import { populateDb } from "../../../../testingData/populateDb";
import { verify } from "jsonwebtoken";
import { verifyApiResponseFactory } from "../../../../testingData/verifyApiResponseFactory";
import {verifyErrorsFactory} from "../../../../testingData/verifyErrorsFactory";

const goodPassword = uuid();
const badPassword = uuid();

const newUser: RegisterForm = {
  firstName: uuid(),
  lastName: uuid(),
  email: `${uuid()}@gmail.com`,
  password: goodPassword,
  confirmedPassword: goodPassword,
};

const newUserEmailAndPassword = {
  email: newUser.email,
  password: newUser.password,
};

const newUserBadPassword = { ...newUser };
newUserBadPassword.confirmedPassword = badPassword;

const alreadyRegisteredUser: RegisterForm = {
  ...testLogin,
  firstName: "Anakin",
  lastName: "Skywalker",
  confirmedPassword: testLogin.password,
};

const newUserBadEmail = { ...newUser };
newUserBadEmail.email = uuid();

const expectedToken = {
  token: "A string",
  expiresAt: "A string",
};

const verifyErrors = verifyErrorsFactory(apiRoutes.register, "POST", "RegistrationError");

const verifyApiRegister = verifyApiResponseFactory(apiRoutes.register, "POST");
const verifyApiDelete = verifyApiResponseFactory(
  apiRoutes.deleteUser,
  "DELETE",
  newUserEmailAndPassword
);

describe("register user", () => {
  it("should successfully create a new user", async () => {
    await verifyApiRegister(newUser, {
      verifyOpt: "TYPE",
      desiredResponse: expectedToken,
      httpCode: 201,
    });
  });

  it("should delete the user that was just created", async () => {
    await verifyApiDelete({
      verifyOpt: "CODE",
    });
  });

  it("should respond with an error if the password and the confirmed passswords do not match", async () => {
    await verifyErrors(newUserBadPassword, "passwordsDontMatch");
  });

  it("should respond with an error if the user has already registered", async () => {
    await verifyErrors(alreadyRegisteredUser, "alreadyRegistered");
  });

  it("should respond with an error if no information is passed along", async () => {
    await verifyErrors({}, "noInformation");
  });

  it("should respond with an error if user supplied an invalid email", async () => {
    await verifyErrors(newUserBadEmail, "invalidEmail");
  });
});
