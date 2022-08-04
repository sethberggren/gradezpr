import { PartialModelObject } from "objection";
import { Assignment } from "../models/Assignment";
import { Course } from "../models/Course";
import { Student } from "../models/Student";
import { User } from "../models/User";
import { AssignmentDetails } from "./getAssignmentStatistics";

export type CurveMethods = "none" | "linear" | "mstd" | "highest" | "second";

export type CurveOptions = {
  min: number;
  max: number;
  mean: number;
  std: number;
};

export type AssignmentResponse = {
  id: number;
  name: string;
  lastUpdated: string;
  curveMethod: string;
  allGradesString: string;
  course: string;
};

export type CurveFunctions = {
  [key in CurveMethods]: (...numbers: number[]) => number;
};

export async function curveGrades<K extends CurveMethods>(
  curveMethod: K,
  curveOptions: CurveOptions,
  rows: string[][],
  assignmentDetails: AssignmentDetails,
  userId: number,
  rawGradeCalculated?: boolean
) {
  const curveFunctions = getCurveFunctions(assignmentDetails, curveOptions);

  const assignmentCourse = (await User.relatedQuery("courses")
    .for(userId)
    .where({ subject: assignmentDetails.courseName })) as Course[];

  const assignmentFields = {
    name: assignmentDetails.assignmentName,
    curveMethod: curveMethod,
    curveOptions: JSON.stringify(curveOptions),
    totalPoints: assignmentDetails.totalPoints,
    sheetsId: assignmentDetails.sheetsId,
    courseId: assignmentCourse[0].id,
  };

  const createdAssignment = (await User.relatedQuery("assignments")
    .for(userId)
    .insertAndFetch(
      new Assignment().$validate(assignmentFields)
    )) as Assignment;

  const responses = rows.slice(1);

  const createdGrades: {
    firstName: string;
    lastName: string;
    grade: number;
  }[] = [];

  for (const response of responses) {
    const earnedPoints = rawGradeCalculated
      ? parseFloat(response[2])
      : parseFloat(response[2].split("/")[0]);
    const rawGrade = (earnedPoints / assignmentDetails.totalPoints) * 100;
    const externalId = response[1].split("@")[0];

    const curvedGrade = curveFunctions[curveMethod](rawGrade);

    const studentName = (await User.relatedQuery("students")
      .select(["firstName", "lastName"])
      .for(userId)
      .where({ externalId: externalId })) as Student[] | [];

    if (studentName.length === 0) {
      continue;
    }

    createdGrades.push({
      firstName: studentName[0].firstName,
      lastName: studentName[0].lastName,
      grade: curvedGrade,
    });
  }

  // create grade string

  let gradeString = "";

  for (const grade of createdGrades) {
    gradeString += `${grade.firstName} ${grade.lastName}\t${grade.grade}\r`;
  }

  await User.relatedQuery("assignments")
    .for(userId)
    .patchAndFetchById(
      createdAssignment.id, {
        allGradesString: gradeString,
      } as PartialModelObject<Assignment>
    );

  const assignmentWithCourse = await Assignment.getAssignmentWithCourse(
    userId,
    createdAssignment.id
  );

  return assignmentWithCourse;
}

export function getCurveFunctions(
  assignmentDetails: AssignmentDetails,
  curveOptions: CurveOptions
): CurveFunctions {
  const {
    highestScore,
    secondHighestScore,
    mean: rawMean,
    std: rawStd,
    lowestScore,
  } = assignmentDetails;
  const { mean: scaledMean, std: scaledStd, min, max } = curveOptions;

  const curveFunctions: CurveFunctions = {
    none: (rawGrade: number) => rawGrade,
    highest: (rawGrade: number) => highestScoreCurve(rawGrade, highestScore),
    second: (rawGrade: number) =>
      secondHighestScoreCurve(rawGrade, secondHighestScore),
    mstd: (rawGrade: number) =>
      meanStdCurve(rawGrade, rawMean, rawStd, scaledMean, scaledStd),
    linear: (rawGrade: number) =>
      linearCurve(rawGrade, lowestScore, highestScore, min, max),
  };

  return curveFunctions;
}

export function meanStdCurve(
  rawGrade: number,
  rawMean: number,
  rawStd: number,
  scaledMean: number,
  scaledStd: number
) {
  const zScore = (rawGrade - rawMean) / rawStd;

  return zScore * scaledStd + scaledMean;
}

export function linearCurve(
  rawGrade: number,
  rawMin: number,
  rawMax: number,
  scaledMin: number,
  scaledMax: number
) {
  return (
    scaledMax +
    ((scaledMin - scaledMax) / (rawMin - rawMax)) * (rawGrade - rawMax)
  );
}

export function highestScoreCurve(rawGrade: number, highestScore: number) {
  const additionalPoints = 100 - highestScore;

  return rawGrade + additionalPoints;
}

export function secondHighestScoreCurve(
  rawGrade: number,
  secondHighestScore: number
) {
  const addtionalPoints = 100 - secondHighestScore;

  return rawGrade + addtionalPoints;
}
