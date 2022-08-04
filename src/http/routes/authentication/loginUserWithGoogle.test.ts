import { TokenPayload } from "google-auth-library";
import { TokenResponse } from "google-auth-library/build/src/auth/impersonated";
import {
  AuthCredentials,
  testToken,
} from "../../../../testingData/addtionalTestInformation";
import { v4 as uuid } from "uuid";
import {
  createUuidGoogleUser,
  deleteUuidGoogleUser,
  uuidGoogleCredentials,
} from "../../../../testingData/userTools";
import * as getGooglePayload from "./getGooglePayload";
import { verifyApiResponseFactory } from "../../../../testingData/verifyApiResponseFactory";
import { verifyErrorsFactory } from "../../../../testingData/verifyErrorsFactory";
import { apiRoutes } from "../apiRoutes";
import { User } from "../../../models/User";

let googleUser: AuthCredentials;
let mockedResponse: TokenPayload;

const mockedGetGooglePayload = jest.spyOn(getGooglePayload, "default");

const verifyApiResponse = verifyApiResponseFactory(
  apiRoutes.loginWithGoogle,
  "POST"
);
const verifyErrors = verifyErrorsFactory(
  apiRoutes.loginWithGoogle,
  "POST",
  "AuthenticationError"
);

describe("login with Google tests", () => {
  beforeAll(async () => {
    await createUuidGoogleUser();

    googleUser = uuidGoogleCredentials();
  });

  beforeEach(async () => {
    mockedResponse = {
      iss: uuid(),
      sub: uuid(),
      aud: uuid(),
      iat: 0,
      exp: 2000,
      email: googleUser.email,
      given_name: uuid(),
      family_name: uuid(),
    };

    mockedGetGooglePayload.mockReset();
    mockedGetGooglePayload.mockImplementation(async () => {
      return mockedResponse;
    });
  });

  afterAll(async () => {
    await deleteUuidGoogleUser();
  });

  it("should be able to login the user with Google", async () => {
    const goodRequest: getGooglePayload.GoogleClientRequest = {
      clientId: uuid(),
      credential: uuid(),
      select_by: uuid(),
    };

    await verifyApiResponse(goodRequest, {
      verifyOpt: "TYPE",
      desiredResponse: testToken,
    });

    expect(mockedGetGooglePayload).toHaveBeenCalledWith(
      expect.objectContaining(goodRequest)
    );
    expect(mockedGetGooglePayload).toHaveBeenCalledTimes(1);
  });

  it("should respond with an error if the user hasn't logged in with Google before", async () => {
    mockedGetGooglePayload.mockImplementation(async () => {
      return undefined;
    });

    const goodRequest: getGooglePayload.GoogleClientRequest = {
      clientId: uuid(),
      credential: uuid(),
      select_by: uuid(),
    };

    await verifyErrors(goodRequest, "noLoginWithGoogle");
    expect(mockedGetGooglePayload).toHaveBeenCalledWith(
      expect.objectContaining(goodRequest)
    );
    expect(mockedGetGooglePayload).toHaveBeenCalledTimes(1);
  });
});
