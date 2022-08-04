import { AuthCredentials } from "../../../../testingData/addtionalTestInformation";
import {createUuidUser, deleteUuidUser, uuidCredentials} from "../../../../testingData/userTools";
import { LinkWithGoogleRequest } from "./linkWithGoogleAccount";
import {v4 as uuid} from "uuid";
import { verifyApiResponseFactory } from "../../../../testingData/verifyApiResponseFactory";
import { apiRoutes } from "../apiRoutes";
import {verifyErrorsFactory} from "../../../../testingData/verifyErrorsFactory"
import { NewToken } from "./generateToken";



let uuidUser : AuthCredentials;

const verifyApiCall = verifyApiResponseFactory(apiRoutes.linkWithGoogle, "POST");
const verifyErrors = verifyErrorsFactory(apiRoutes.linkWithGoogle, "POST", "RegistrationError");

describe("link with Google account test", () => {

    beforeAll(async () => {
        await createUuidUser();

        uuidUser = uuidCredentials();
    });

    afterAll(async () => {
        await deleteUuidUser();
    });

    it("should be able to link successfully", async () => {

        const goodRequest : LinkWithGoogleRequest = {
            email: uuidUser.email,
            password: uuidUser.password,
            confirmedPassword: uuidUser.password
        };

        const goodResponse : NewToken = {
            token: "Some string",
            expiresAt: "Some date as a string"
        }

        await verifyApiCall(goodRequest, {verifyOpt: "TYPE", desiredResponse: goodResponse});
    });

    it("should return an error if no information is sent", async () => {

        const badRequest = {
            email: uuidUser.email,
            password: uuidUser.password,
            confirmedPass: uuid()
        }

       await verifyErrors(badRequest, "noInformation");
    });

    it("should return an error if the passwords don't match", async () => {
        const badRequest : LinkWithGoogleRequest = {
            email: uuidUser.email,
            password: uuidUser.password,
            confirmedPassword: uuid()
        };

        await verifyErrors(badRequest, "passwordsDontMatch");
    });

    it("should return an error if the user sends over a password that does not match what's in the DB", async () => {

        const badPassword = uuid();

        const badRequest : LinkWithGoogleRequest = {
            email: uuidUser.email,
            password: badPassword,
            confirmedPassword: badPassword
        };

        await verifyErrors(badRequest, "invalidPassword");
    });
})