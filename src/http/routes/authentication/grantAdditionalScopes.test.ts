
import {createUuidGoogleUser, deleteUuidGoogleUser, uuidCredentials, uuidGoogleCredentials} from "../../../../testingData/userTools"
import { verifyApiResponseFactory } from "../../../../testingData/verifyApiResponseFactory";
import {verifyErrorsFactory} from "../../../../testingData/verifyErrorsFactory";
import { apiRoutes } from "../apiRoutes";
import * as getTokens from "./getGoogleTokens";
import {v4 as uuid} from "uuid";
import {REQUIRED_SCOPES} from "../../../config";
import { GrantAdditionalScopesRequest } from "./grantAdditionalScopes";

const userCredentials = uuidGoogleCredentials();

const request : GrantAdditionalScopesRequest = {
    code: uuid()
}


let verifyApiResponse = verifyApiResponseFactory(apiRoutes.grantAdditionalScopes, "POST", userCredentials);
const verifyErrors = verifyErrorsFactory(apiRoutes.grantAdditionalScopes, "POST", "GoogleError", userCredentials);

const getTokensMock = jest.spyOn(getTokens, "getGoogleTokens");

describe("grant additional scopes test", () => {

    beforeAll(async () => {
       await createUuidGoogleUser();
    });

    beforeEach(() => {
        getTokensMock.mockClear();

        getTokensMock.mockImplementation(async () => {
            return {
                refresh_token: uuid(),
                scope: REQUIRED_SCOPES.join(" ")
            }
        });
    });

    afterAll(async () => {
      await  deleteUuidGoogleUser();
    });

    it("should be able to grant additional scopes", async () => {

        await verifyApiResponse(request, {verifyOpt: "CODE"});
        expect(getTokensMock).toHaveBeenCalledWith(request.code);
        expect(getTokensMock).toHaveBeenCalledTimes(1);
    });

    it("should respond with an error if the correct scopes are not provided", async () => {
        getTokensMock.mockImplementation(async () => {
            return {
                refresh_token: uuid(),
                scope: REQUIRED_SCOPES[0]
            }
        });

        await verifyErrors(request, "noScopes");
        expect(getTokensMock).toHaveBeenCalledWith(request.code);
        expect(getTokensMock).toHaveBeenCalledTimes(1);
    });

    it("should respond with an error if the incorrect code is passed to the server", async () => {
        await verifyErrors({}, "noInformation");

        await verifyErrors({code: 4223}, "noInformation");

        expect(getTokensMock).not.toHaveBeenCalled();
    });

    it("should respond with an error if the refresh token is not provided by the Google OAuth client", async () => {

        getTokensMock.mockImplementation(async () => {
            return {
                scope: REQUIRED_SCOPES.join(" ")
            }
        });

        await verifyErrors(request, "unknownError");
        expect(getTokensMock).toHaveBeenCalledWith(request.code);
        expect(getTokensMock).toHaveBeenCalledTimes(1);
    });
})