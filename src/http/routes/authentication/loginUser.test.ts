import {
  testLogin,
} from "../../../../testingData/addtionalTestInformation";
import app from "../../../app";
import { default as request } from "supertest";
import { apiRoutes } from "../apiRoutes";
import { NewToken } from "./generateToken";
import { getErrorFactory } from "../../errorResponses";
import { populateDb } from "../../../../testingData/populateDb";
import { UUID } from "io-ts-types";
import { verifyApiResponseFactory } from "../../../../testingData/verifyApiResponseFactory";
import {verifyErrorsFactory} from "../../../../testingData/verifyErrorsFactory";
import { googleDefaultPassword } from "./registerWithGoogle";

const verifyErrors = verifyErrorsFactory(apiRoutes.login, "POST", "AuthenticationError");
const verifyApiResponse = verifyApiResponseFactory(apiRoutes.login, "POST");

export const badTestLogin = {
  email: "palpatine@thesentate.net",
  password: "dew1tN0w",
};

export const testLoginBadPassword = {
  email: testLogin.email,
  password: "I<3Padme",
};


const expectedToken = {
  token: "A string",
  expiresAt: "A string",
};

describe("login user", () => {
  beforeAll(async () => {
    await populateDb(false);
  });

  it("should login user with email and password", async () => {
    // const req = testLogin;

    // const response = await request(app)
    //   .post(apiRoutes.login)
    //   .send(req)
    //   .expect("Content-Type", /json/);
    // const responseData = response.body as NewToken;

    // expect(response.statusCode).toBe(200);
    // expect(responseData).toHaveProperty("token");
    // expect(responseData).toHaveProperty("expiresAt");
    // expect(typeof responseData.token).toBe("string");
    // expect(typeof responseData.expiresAt).toBe("string");

    await verifyApiResponse(testLogin, {
      verifyOpt: "TYPE",
      desiredResponse: expectedToken,
    });
  });

  it("should respond with status code 401 if account does not exist", async () => {
    await verifyErrors(badTestLogin, "userDoesNotExist");
  });

  it("should respond with status code 401 if no email or password information is passed along", async () => {
    await verifyErrors({}, "noEmailOrPassword");
  });

  it("should responsd with status code 401 if wrong password is passed along", async () => {
    await verifyErrors(testLoginBadPassword, "accountInformationMismatch");
  });

  it("should respond with an error if the user tries to use the default Google Password to login", async () => {
    await verifyErrors({email: testLogin.email, password: googleDefaultPassword}, "accountInformationMismatch");
  })
});

