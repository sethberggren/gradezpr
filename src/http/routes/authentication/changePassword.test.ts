import {
  testLogin,
} from "../../../../testingData/addtionalTestInformation";
import { populateDb } from "../../../../testingData/populateDb";
import { verifyApiResponseFactory } from "../../../../testingData/verifyApiResponseFactory";
import { verifyErrorsFactory } from "../../../../testingData/verifyErrorsFactory";
import { getErrorFactory } from "../../errorResponses";
import { apiRoutes } from "../apiRoutes";

type ChangePasswordRequest = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const goodNewPassword = "I<3Padm3*.*";
const badNewPassword = "IH8S4Nd9@9";

const goodRequest: ChangePasswordRequest = {
  oldPassword: testLogin.password,
  newPassword: goodNewPassword,
  confirmPassword: goodNewPassword,
};

const badRequestPasswordsDontMatch: ChangePasswordRequest = {
  oldPassword: testLogin.password,
  newPassword: goodNewPassword,
  confirmPassword: badNewPassword,
};

const badRequestIncorrectPassword: ChangePasswordRequest = {
  oldPassword: badNewPassword,
  newPassword: goodNewPassword,
  confirmPassword: goodNewPassword,
};

const resetPassword: ChangePasswordRequest = {
  oldPassword: goodNewPassword,
  newPassword: testLogin.password,
  confirmPassword: testLogin.password,
};

const verifyPasswordRequest = verifyApiResponseFactory(
  apiRoutes.changePassword,
  "PATCH"
);
const verifyErrors = verifyErrorsFactory(apiRoutes.changePassword, "PATCH", "PasswordChangeError");

describe("change password endpoint", () => {
  beforeAll(async () => {
    await populateDb(false);
  });

  afterAll(async () => {
    const verifyPasswordRequestNewAuthentication = verifyApiResponseFactory(
      apiRoutes.changePassword,
      "PATCH",
      { email: testLogin.email, password: goodNewPassword }
    );
    await verifyPasswordRequestNewAuthentication(resetPassword, {
      verifyOpt: "CODE",
    });
  });

  it("should respond with an error if no information is sent along", async () => {
    await verifyErrors({}, "noInformation");
  });

  it("should respond with an error if the passwords don't match", async () => {
    await verifyErrors(
      badRequestPasswordsDontMatch,
      "passwordsDontMatch"
    );
  });

  it("should respond with an error if the old password sent over by the user does not match what is in the database", async () => {
    await verifyErrors(
      badRequestIncorrectPassword,
      "incorrectPassword"
    );
  });

  it("should respond appropriately with the correct information passed along", async () => {
    await verifyPasswordRequest(goodRequest, {
      verifyOpt: "CODE",
    });
  });
});
