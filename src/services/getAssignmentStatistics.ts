import { mean } from "lodash";
import {
  median,
  lowestNum,
  highestNum,
  secondHighestNum,
  std,
} from "../lib/helperFunctions";

export type AssignmentDetails = {
  assignmentName: string;
  courseName: string;
  sheetsId: string;
  totalPoints: number;
  highestScore: number;
  secondHighestScore: number;
  mean: number;
  median: number;
  lowestScore: number;
  std: number;
};

export default function getAssignmentStatistics(
  // think about getting google sheets to return as column arrays instead of row arrays...would be much faster?
  rows: string[][],
  assignmentName: string,
  courseName: string,
  sheetsId: string,
  rawGradesCalculated?: boolean
) {
  const parsedResponses: AssignmentDetails = {
    assignmentName: assignmentName.replace("(Responses)", ""),
    courseName: courseName,
    totalPoints: rawGradesCalculated
      ? 100
      : parseFloat(rows[1][2].split("/")[1]),
    highestScore: 0,
    mean: 0,
    median: 0,
    lowestScore: 0,
    secondHighestScore: 0,
    std: 0,
    sheetsId: "",
  };

  // student responses start from the second element of the array, since the first element of the rows array contains headers.
  const responses = rows.slice(1);
  const scores: number[] = [];

  for (const response of responses) {
    let earnedPoints = 0;
    if (rawGradesCalculated) {
      earnedPoints = parseFloat(response[2]);
    } else {
      earnedPoints =
        (parseFloat(response[2].split("/")[0]) / parsedResponses.totalPoints) *
        100;
    }

    scores.push(earnedPoints);
  }

  parsedResponses.mean = mean(scores);
  parsedResponses.median = median(scores);
  parsedResponses.lowestScore = lowestNum(scores);
  parsedResponses.highestScore = highestNum(scores);
  parsedResponses.secondHighestScore = secondHighestNum(scores);
  parsedResponses.std = std(scores, parsedResponses.mean);
  parsedResponses.sheetsId = sheetsId;

  return parsedResponses;
}
