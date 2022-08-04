import { Response } from "express";

const unknownErrorResponse = "An unknown error occured - please try again.";
const noInformationResponse = "Incorrect Information";

export type ErrorResponse<K extends ErrorTypes> = {
  errorCode: number;
  errorBody: {
    name: K;
    message: string;
  };
};

export type ErrorTypes =
  | "AuthenticationError"
  | "RegistrationError"
  | "PasswordChangeError"
  | "UnknownError"
  | "StudentError"
  | "CourseError"
  | "UploadError"
  | "AssignmentError"
  | "GoogleError" | "UserRequestError";

type CustomError = {
  [k in ErrorTypes]: ErrorInformation<k>;
};
export type ErrorSubtypes<K extends ErrorTypes> =
  K extends "AuthenticationError"
    ? AuthenticationErrors
    : K extends "RegistrationError"
    ? RegistrationErrors
    : K extends "PasswordChangeError"
    ? PasswordChangeErrors
    : K extends "UnknownError"
    ? UnknownErrors
    : K extends "StudentError"
    ? StudentErrors
    : K extends "CourseError"
    ? CourseErrors
    : K extends "UploadError"
    ? UploadErrors
    : K extends "AssignmentError"
    ? AssignmentErrors
    : K extends "GoogleError"
    ? GoogleErrors : K extends "UserRequestError" ? UserRequestErrors
    : never;

type ErrorInformation<K extends ErrorTypes> = {
  [key in ErrorSubtypes<K>]: ErrorResponse<K>;
};

export type AuthenticationErrors =
  | "userDoesNotExist"
  | "noEmailOrPassword"
  | "accountInformationMismatch"
  | "noLoginWithGoogle"
  | "unknownError"
  | "tokenExpired";

const authenticationErrors: ErrorInformation<"AuthenticationError"> = {
  userDoesNotExist: {
    errorCode: 401,
    errorBody: {
      name: "AuthenticationError",
      message: "The user does not exist - create an account and login.",
    },
  },
  noEmailOrPassword: {
    errorCode: 401,
    errorBody: {
      name: "AuthenticationError",
      message: "Unauthorized.",
    },
  },
  accountInformationMismatch: {
    errorCode: 401,
    errorBody: {
      name: "AuthenticationError",
      message: "Incorrect credentials.",
    },
  },
  noLoginWithGoogle: {
    errorCode: 400,
    errorBody: {
      name: "AuthenticationError",
      message: "User has not registered with Google.",
    },
  },
  unknownError: {
    errorCode: 500,
    errorBody: {
      name: "AuthenticationError",
      message: unknownErrorResponse,
    },
  },
  tokenExpired: {
    errorCode: 400,
    errorBody: {
      name: "AuthenticationError",
      message: "Your credentials have expired.  Please login again.",
    },
  },
};

type RegistrationErrors =
  | "alreadyRegistered"
  | "passwordsDontMatch"
  | "unknownError"
  | "noInformation"
  | "invalidEmail"
  | "invalidPassword";

const registrationErrors: ErrorInformation<"RegistrationError"> = {
  alreadyRegistered: {
    errorCode: 400,
    errorBody: {
      name: "RegistrationError",
      message: "You already have an account, please login.",
    },
  },
  passwordsDontMatch: {
    errorCode: 400,
    errorBody: {
      name: "RegistrationError",
      message: "Your passwords do not match",
    },
  },
  unknownError: {
    errorCode: 500,
    errorBody: {
      name: "RegistrationError",
      message: unknownErrorResponse,
    },
  },
  noInformation: {
    errorCode: 400,
    errorBody: {
      name: "RegistrationError",
      message: noInformationResponse,
    },
  },
  invalidEmail: {
    errorCode: 400,
    errorBody: {
      name: "RegistrationError",
      message: "Please enter a valid email address.",
    },
  },
  invalidPassword: {
    errorCode: 400,
    errorBody: {
      name: "RegistrationError",
      message: "Incorrect credentials, please try again.",
    },
  },
};

type PasswordChangeErrors =
  | "noInformation"
  | "passwordsDontMatch"
  | "incorrectPassword"
  | "unknownError";

const passwordChangeErrors: ErrorInformation<"PasswordChangeError"> = {
  noInformation: {
    errorCode: 400,
    errorBody: {
      name: "PasswordChangeError",
      message: noInformationResponse,
    },
  },
  incorrectPassword: {
    errorCode: 400,
    errorBody: {
      name: "PasswordChangeError",
      message: "Invalid credentials",
    },
  },
  passwordsDontMatch: {
    errorCode: 400,
    errorBody: {
      name: "PasswordChangeError",
      message: "Your passwords do not match.",
    },
  },
  unknownError: {
    errorCode: 500,
    errorBody: {
      name: "PasswordChangeError",
      message: unknownErrorResponse,
    },
  },
};

type UnknownErrors = "unknownError";

const unknownErrors: ErrorInformation<"UnknownError"> = {
  unknownError: {
    errorCode: 500,
    errorBody: {
      name: "UnknownError",
      message: unknownErrorResponse,
    },
  },
};

export type StudentErrors =
  | "unknownError"
  | "noInformation"
  | "noDuplicateStudents"
  | "courseNotCreated"
  | "noBulkFile"
  | "cannotEditDoesNotExist"
  | "didntUseTemplate"
  | "wrongFileType";

const studentErrors: ErrorInformation<"StudentError"> = {
  unknownError: {
    errorCode: 500,
    errorBody: {
      name: "StudentError",
      message: unknownErrorResponse,
    },
  },
  noInformation: {
    errorCode: 400,
    errorBody: {
      name: "StudentError",
      message: noInformationResponse,
    },
  },
  noDuplicateStudents: {
    errorCode: 422,
    errorBody: {
      name: "StudentError",
      message: "Student is already created - no duplicates allowed.",
    },
  },
  courseNotCreated: {
    errorCode: 422,
    errorBody: {
      name: "StudentError",
      message:
        "Student's course is not created.  Create the course, then add the student.",
    },
  },
  noBulkFile: {
    errorCode: 400,
    errorBody: {
      name: "StudentError",
      message: "No file was uploaded.",
    },
  },
  cannotEditDoesNotExist: {
    errorCode: 400,
    errorBody: {
      name: "StudentError",
      message: "Cannot edit student - student does not exist.",
    },
  },
  didntUseTemplate: {
    errorCode: 400,
    errorBody: {
      name: "StudentError",
      message: "Did not use the roster upload template.",
    },
  },
  wrongFileType: {
    errorCode: 400,
    errorBody: {
      name: "StudentError",
      message: "Please upload a .xlsx file",
    },
  },
};

type CourseErrors = "alreadyExists" | "unknownError" | "noInformation";

const courseErrors: ErrorInformation<"CourseError"> = {
  alreadyExists: {
    errorCode: 422,
    errorBody: {
      name: "CourseError",
      message: "Course is already created - no duplicates allowed.",
    },
  },
  unknownError: {
    errorCode: 500,
    errorBody: {
      name: "CourseError",
      message: unknownErrorResponse,
    },
  },
  noInformation: {
    errorCode: 400,
    errorBody: {
      name: "CourseError",
      message: "Invalid information.",
    },
  },
};

type UploadErrors =
  | "wrongFileType"
  | "unknownError"
  | "invalidInformation"
  | "badData";

const uploadErrors: ErrorInformation<"UploadError"> = {
  wrongFileType: {
    errorCode: 400,
    errorBody: {
      name: "UploadError",
      message: "Please upload a .xlsx file.",
    },
  },

  unknownError: {
    errorCode: 500,
    errorBody: {
      name: "UploadError",
      message: unknownErrorResponse,
    },
  },
  invalidInformation: {
    errorCode: 400,
    errorBody: {
      name: "UploadError",
      message: "Invalid information.",
    },
  },
  badData: {
    errorCode: 422,
    errorBody: {
      name: "UploadError",
      message:
        "Please make sure your file upload includes an ID column, a grades column, and at least one grade.",
    },
  },
};

type AssignmentErrors = "noInformation" | "unknownError";

const assignmentErrors: ErrorInformation<"AssignmentError"> = {
  noInformation: {
    errorCode: 400,
    errorBody: {
      name: "AssignmentError",
      message: noInformationResponse,
    },
  },
  unknownError: {
    errorCode: 500,
    errorBody: {
      name: "AssignmentError",
      message: unknownErrorResponse,
    },
  },
};

export type GoogleErrors =
  | "noScopes"
  | "unknownError"
  | "noInformation"
  | "notGoogleFormsSpreadsheet";

const googleErrors: ErrorInformation<"GoogleError"> = {
  noScopes: {
    errorCode: 400,
    errorBody: {
      name: "GoogleError",
      message:
        "Did not provide access to Google Sheets and Google Drive, so cannot import grades with Google Sheets.",
    },
  },
  unknownError: {
    errorCode: 500,
    errorBody: {
      name: "GoogleError",
      message: unknownErrorResponse,
    },
  },
  noInformation: {
    errorCode: 400,
    errorBody: {
      name: "GoogleError",
      message: noInformationResponse,
    },
  },
  notGoogleFormsSpreadsheet: {
    errorCode: 400,
    errorBody: {
      name: "GoogleError",
      message: "Not a Google Forms response sheet.  Currently, Gradezpr only supports Google Forms response sheets.",
    },
  },
};

type UserRequestErrors = "noInformation" | "unknownError";

const userRequestErrors : ErrorInformation<"UserRequestError"> = {
  noInformation: {
    errorCode: 400,
    errorBody: {
      name: "UserRequestError",
      message: noInformationResponse
    }
  },
  unknownError: {
    errorCode: 500,
    errorBody: {
      name: "UserRequestError",
      message: unknownErrorResponse
    }
  }
}

const errors: CustomError = {
  AuthenticationError: authenticationErrors,
  RegistrationError: registrationErrors,
  PasswordChangeError: passwordChangeErrors,
  UnknownError: unknownErrors,
  StudentError: studentErrors,
  CourseError: courseErrors,
  UploadError: uploadErrors,
  AssignmentError: assignmentErrors,
  GoogleError: googleErrors,
  UserRequestError: userRequestErrors
};

export function getErrorFactory<K extends ErrorTypes>(errorType: K) {
  return (errorSubtype: ErrorSubtypes<K>) => {
    return errors[errorType][errorSubtype];
  };
}

export function sendErrorFactory<K extends ErrorTypes>(
  res: Response,
  errorType: K
) {
  return (errorSubtype: ErrorSubtypes<K>) => {
    const { errorCode, errorBody } = errors[errorType][errorSubtype];
    res.status(errorCode).send(errorBody);
  };
}
