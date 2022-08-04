import { AuthCredentials } from "../../../../testingData/addtionalTestInformation";
import {
  createUuidUser,
  deleteUser,
  deleteUuidUser,
  uuidCredentials,
} from "../../../../testingData/userTools";
import { verifyApiResponseFactory } from "../../../../testingData/verifyApiResponseFactory";
import { verifyErrorsFactory } from "../../../../testingData/verifyErrorsFactory";
import { v4 as uuid } from "uuid";
import { apiRoutes } from "../apiRoutes";
import * as getGooglePayload from "./getGooglePayload";
import { RegisterForm } from "./authenticationRouter";
import { NewToken } from "./generateToken";

let uuidUser: AuthCredentials;

const newGoogleUser: RegisterForm = {
  firstName: uuid(),
  lastName: uuid(),
  email: uuid(),
  password: "GOOGLE LOGIN",
};

const mockedData = {
  iss: uuid(),
  sub: uuid(),
  iat: 4,
  exp: 10,
  aud: uuid(),
  email: newGoogleUser.email,
  given_name: newGoogleUser.firstName,
  family_name: newGoogleUser.lastName,
};

const verifyApiCall = verifyApiResponseFactory(
  apiRoutes.registerWithGoogle,
  "POST"
);
const verifyErrors = verifyErrorsFactory(
  apiRoutes.registerWithGoogle,
  "POST",
  "RegistrationError"
);

const getGooglePayloadMock = jest.spyOn(getGooglePayload, "default");

describe("register with Google Test", () => {

  beforeEach(() => {
    getGooglePayloadMock.mockReset();
    getGooglePayloadMock.mockImplementation(async () => {return mockedData});
  })

  afterAll(async () => {
    await deleteUser({email: newGoogleUser.email, password: newGoogleUser.password});
  });

  it("should be able to register the user with google", async () => {
    const goodRequest : getGooglePayload.GoogleClientRequest = {
        clientId: uuid(),
        credential: uuid(),
        select_by: uuid()
    };

    const goodResponse : NewToken = {
        token: "This is a token",
        expiresAt: "This is the date in string form."
    }

    await verifyApiCall(goodRequest, {verifyOpt: "TYPE", desiredResponse: goodResponse});
    expect(getGooglePayloadMock).toHaveBeenCalledWith(expect.objectContaining(goodRequest));
    expect(getGooglePayloadMock).toHaveBeenCalledTimes(1);
    
  });

  it("should respond with an error if the user already exists", async () => {
    const goodRequest : getGooglePayload.GoogleClientRequest = {
        clientId: uuid(),
        credential: uuid(),
        select_by: uuid()
    };

    await verifyErrors(goodRequest, "alreadyRegistered");
    expect(getGooglePayloadMock).toHaveBeenCalledWith(expect.objectContaining(goodRequest));
    expect(getGooglePayloadMock).toHaveBeenCalledTimes(1);
   
  });

  it("should respond with an error if no information is sent over", async () => {

    const badRequest = {
        clientId: uuid(),
        credential: uuid(),
        selectBy: uuid(),
    };

    await verifyErrors(badRequest, "noInformation");

    expect(getGooglePayloadMock).toHaveBeenCalledTimes(0);
  });

});
