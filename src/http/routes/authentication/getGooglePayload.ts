import { OAuth2Client } from "google-auth-library";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../../../config";
import { TokenPayload } from "google-auth-library";

export type GoogleClientRequest = {
  clientId: string;
  credential: string;
  select_by: string;
};

const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);

export default async function getGooglePayload(
  googleClientRequest: GoogleClientRequest
) {
  const ticket = await client.verifyIdToken({
    idToken: googleClientRequest.credential,
    audience: googleClientRequest.clientId,
  });

  const payload = ticket.getPayload();

  return payload;
}
