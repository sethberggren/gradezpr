import { string } from "io-ts";
import { default as request } from "supertest";
import app from "../src/app";
import { ErrorResponse, ErrorTypes } from "../src/http/errorResponses";
import { apiRoutes } from "../src/http/routes/apiRoutes";
import { ObjectTyped } from "object-typed";
import { getCourseString, testCourses } from "./populateDb";
import _ from "lodash";
import { Options } from "express-fileupload";
import { NewToken } from "../src/http/routes/authentication/generateToken";

export const testLogin = {
  email: "anakin_skywalker@theforce.net",
  password: "ch0s3n1*",
};
export type AuthCredentials = {
  email: string;
  password: string;
};

export const testToken : NewToken = {
  token: "This is a token",
  expiresAt: "This is the token's expiry time in string form."
}

export const tokenHeader = async (user?: AuthCredentials) => {
  const response = await request(app)
    .post(apiRoutes.login)
    .send(user ? user : testLogin);

  const toReturn = { "x-access-token": response.body.token as string };

  return toReturn;
};

export type HTTPMethods = "DELETE" | "PUT" | "POST" | "PATCH" | "GET";

const sortString = (
  str1: string,
  str2: string,
  ascOrDesc: "descending" | "ascending"
) => {
  const str1Upper = str1.toUpperCase();
  const str2Upper = str2.toUpperCase();
  if (ascOrDesc === "ascending") {
    return str1Upper < str2Upper ? -1 : str2Upper > str1Upper ? 1 : 0;
  } else {
    return str2Upper < str1Upper ? -1 : str1Upper > str2Upper ? 1 : 0;
  }
};

const nRandomArrayElements = <K extends any>(array: K[], n: number) => {
  const shuffled = array.sort(() => 0.5 - Math.random());

  return shuffled.slice(0, n);
};

export const randomTestCoursesString = () => {
  const numberOfRandomCourses = _.random(1, testCourses.length);

  const randomCourses = nRandomArrayElements(
    testCourses,
    numberOfRandomCourses
  );

  randomCourses.sort((a, z) => sortString(a.subject, z.subject, "descending"));

  return getCourseString(randomCourses);
};

export const compareObjects = <K extends any>(received: any, desired: K) => {
  expect(JSON.parse(JSON.stringify(received))).toStrictEqual<K>(
    JSON.parse(JSON.stringify(desired))
  );
};
