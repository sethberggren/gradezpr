import { default as request } from "supertest";
import app from "../src/app";
import { ErrorTypes, ErrorResponse, ErrorSubtypes, getErrorFactory } from "../src/http/errorResponses";
import { AuthCredentials, HTTPMethods, tokenHeader } from "./addtionalTestInformation";

export const verifyErrorMessage = <K extends ErrorTypes>(
    errorResponse: ErrorResponse<K>,
    response: request.Response
  ) => {
    const { errorCode, errorBody } = errorResponse;
  
    expect(response.body).toStrictEqual(errorBody);
    expect(response.statusCode).toBe(errorCode);
  };
  
  // export const verifyErrors = async <K extends ErrorTypes>(
  //   httpOptions: HTTPOptions,
  //   errorResponse: ErrorResponse<K>
  // ) => {
  //   const { url } = httpOptions;
  
  //   switch (httpOptions.method) {
  //     case "DELETE": {
  //       const response = await request(app)
  //         .delete(url)
  //         .expect("Content-Type", /json/);
  
  //       verifyErrorMessage(errorResponse, response);
  //       return;
  //     }
  
  //     case "GET": {
  //       const response = await request(app)
  //         .get(url)
  //         .expect("Content-Type", /json/);
  //       verifyErrorMessage(errorResponse, response);
  //       return;
  //     }
  
  //     case "PATCH": {
  //       const response = await request(app)
  //         .patch(url)
  //         .send(httpOptions.requestPayload)
  //         .expect("Content-Type", /json/);
  //       verifyErrorMessage(errorResponse, response);
  //       return;
  //     }
  
  //     case "PUT": {
  //       const response = await request(app)
  //         .put(url)
  //         .send(httpOptions.requestPayload)
  //         .expect("Content-Type", /json/);
  
  //       verifyErrorMessage(errorResponse, response);
  //       return;
  //     }
  
  //     case "POST": {
  //       const response = await request(app)
  //         .post(url)
  //         .send(httpOptions.requestPayload)
  //         .expect("Content-Type", /json/);
  
  //       verifyErrorMessage(errorResponse, response);
  //       return;
  //     }
  
  //     default: {
  //       throw new Error("Must pass along HTTP method");
  //     }
  //   }
  // };
  
  export function verifyErrorsFactory<K extends ErrorTypes>(
    url: string,
    httpMethod: "DELETE" | "GET",
    errorType: K,
    authentication?: AuthCredentials,
  ): (errorResponse: ErrorSubtypes<K>) => Promise<void>;
  export function verifyErrorsFactory<K extends ErrorTypes>(
    url: string,
    httpMethod: "POST" | "PUT" | "PATCH",
    errorType: K,
    authentication?: AuthCredentials
  ): (requestPayload: Object, errorResponse: ErrorSubtypes<K>, ) => Promise<void>;
  
  export function verifyErrorsFactory<K extends ErrorTypes>(
    url: string,
    httpMethod: HTTPMethods,
    errorType: K,
    authentication?: AuthCredentials
  ) {

    const getError = getErrorFactory(errorType);
    switch (httpMethod) {
      case "DELETE": {
        return async (errorResponse: ErrorSubtypes<K>) => {
          const header = await tokenHeader(authentication);
          const response = await request(app)
            .delete(url)
            .set(header)
            .expect("Content-Type", /json/);
  
          verifyErrorMessage(getError(errorResponse), response);
          return;
        };
      }
  
      case "POST": {
        return async (
          requestPayload: Object,
          errorResponse: ErrorSubtypes<K>
        ) => {
          const header = await tokenHeader(authentication);
          const response = await request(app)
            .post(url)
            .send(requestPayload)
            .set(header)
            .expect("Content-Type", /json/);
  
          verifyErrorMessage(getError(errorResponse), response);
          return;
        };
      }
  
      case "GET": {
        return async (errorResponse: ErrorSubtypes<K>) => {
          const header = await tokenHeader(authentication);
          const response = await request(app)
            .get(url)
            .set(header)
            .expect("Content-Type", /json/);
  
          verifyErrorMessage(getError(errorResponse), response);
          return;
        };
      }
  
      case "PATCH": {
        return async (
          requestPayload: Object,
          errorResponse: ErrorSubtypes<K>,
        ) => {
          const header = await tokenHeader(authentication);
          const response = await request(app)
            .patch(url)
            .send(requestPayload)
            .set(header)
            .expect("Content-Type", /json/);
  
          verifyErrorMessage(getError(errorResponse), response);
          return;
        };
      }
  
      case "PUT": {
        return async (
          requestPayload: Object,
          errorResponse: ErrorSubtypes<K>
        ) => {
          const header = await tokenHeader(authentication);
          const response = await request(app)
            .put(url)
            .send(requestPayload)
            .set(header)
            .expect("Content-Type", /json/);
  
          verifyErrorMessage(getError(errorResponse), response);
          return;
        };
      }
    }
  }