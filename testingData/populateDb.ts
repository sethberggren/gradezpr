// populate the database with dummy information
// first, check if resource exists to avoid duplication

import { User } from "../src/models/User";
import bycrypt from "bcrypt";
import { Student } from "../src/models/Student";
import { Course } from "../src/models/Course";
import { isNewExpression } from "typescript";
import { Assignment } from "../src/models/Assignment";
import getUserByEmail from "../src/http/routes/authentication/getUserByEmail";
import { InitializeResponse } from "../src/http/routes/initialize/initializeRouter";
import {v4 as uuid} from "uuid";

const getTestUser = async () => {
  return {
    firstName: "Anakin",
    lastName: "Skywalker",
    email: "anakin_skywalker@theforce.net",
    password: await bycrypt.hash("ch0s3n1*", 10),
    permission: 3,
    googleToken: uuid()
  };
};

const masteringTheForce = {
  subject: "Mastering the Force",
};

const lavaBurns101 = {
  subject: "Lava Burns 101",
};

const decipheringPainfulVisions = {
  subject: "Deciphering Painful Visions",
};

const diplomacyForDummies = {
  subject: "Diplomacy for Dummies",
};

export const testCourses = [
  masteringTheForce,
  lavaBurns101,
  decipheringPainfulVisions,
  diplomacyForDummies,
]

export function getCourseString(courses: { subject: string }[]) {
  const str = courses.reduce((prev, curr) => {
    return `${curr.subject}, ${prev}`;
  }, "");

  return str.slice(0, -2);
}

type DummyStudent = {
  firstName: string;
  lastName: string;
  externalId: string;
  courses: string;
};

function splitCourses(student: DummyStudent) {
  return student.courses.split(",").map((course) => course.trim());
}

const testStudents: DummyStudent[] = [
  {
    firstName: "Padme",
    lastName: "Amidala",
    externalId: "1",
    courses: getCourseString([masteringTheForce, diplomacyForDummies]),
  },
  {
    firstName: "Bail",
    lastName: "Organa",
    externalId: "2",
    courses: getCourseString([masteringTheForce, diplomacyForDummies]),
  },
  {
    firstName: "Obi-Wan",
    lastName: "Kenobi",
    externalId: "3",
    courses: getCourseString([masteringTheForce, lavaBurns101]),
  },
  {
    firstName: "Mace",
    lastName: "Windu",
    externalId: "4",
    courses: getCourseString([masteringTheForce, decipheringPainfulVisions]),
  },
  {
    firstName: "Shaak",
    lastName: "Ti",
    externalId: "5",
    courses: getCourseString([masteringTheForce]),
  },
];

type DummyAssignment = {
  name: string;
  curveMethod: string;
  curveOptions: string;
  allGradesString: string;
  course: string;
  totalPoints: number;
  sheetsId: string;
};

const lightSaberMasteryGrades =
  "Padme Amidala\t100\rBail Organa\t75\rObi-Wan Kenobi\t90\rMace Windu\t40\rShaak Ti\t88";

const lightsaberMastery: DummyAssignment = {
  name: "Lightsaber Master",
  curveMethod: "linear",
  totalPoints: 100,
  curveOptions: JSON.stringify({ min: 50, max: 100, mean: null, std: null }),
  allGradesString: lightSaberMasteryGrades,
  course: masteringTheForce.subject,
  sheetsId: "upload",
};

const howToHateSandGrades =
  "Padme Amidala\t50\rBail Organa\t75\rObi-Wan Kenobi\t100\rMace Windu\t25\rShaak Ti\t93";

const howToHateSand: DummyAssignment = {
  name: "How to Hate Sand",
  curveMethod: "none",
  totalPoints: 100,
  curveOptions: JSON.stringify({ min: null, max: null, mean: null, std: null }),
  allGradesString: howToHateSandGrades,
  course: masteringTheForce.subject,
  sheetsId: "asdf32-upyucc56-caqui3",
};

const testAssignments: DummyAssignment[] = [lightsaberMastery, howToHateSand];


// export async function populateDb(returnResults: false): Promise<void>;

export async function populateDb(returnResults: true): Promise<InitializeResponse>;

export async function populateDb(returnResults: false): Promise<void>;

export async function populateDb(returnResults: boolean): Promise<void | InitializeResponse> {
  const knex = User.knex();
  // check if test user exists and create if doesn't exist
  let testUser: User;

  const testUserData = await getTestUser();

  const possibleUser = (await User.query()
    .select()
    .where("email", testUserData.email)) as User[];

  if (possibleUser.length !== 1) {
    testUser = await User.query().insertAndFetch(testUserData);
    console.log("Created test user");
  } else {
    testUser = possibleUser[0];
    // console.log("Test user already exists.");
  }

  const testUserId = testUser.id;

  // check if test courses exist and create if don't exist

  for (const course of testCourses) {
    const possibleCourse = await User.relatedQuery("courses")
      .for(testUserId)
      .where("subject", course.subject);

    if (possibleCourse.length !== 1) {
      const newCourseVerified = new Course().$validate(course);
      await User.relatedQuery("courses")
        .for(testUser.id)
        .insert(newCourseVerified);
      console.log(`Created course: ${course.subject}`);
    } else {
      // console.log(`Course already exists: ${course.subject}`);
    }
  }

  // check if test students exist and create if don't exist

  for (const student of testStudents) {
    const possibleStudent = await User.relatedQuery("students")
      .for(testUserId)
      .where({ externalId: student.externalId });

    if (possibleStudent.length !== 1) {
      const newStudentVerified = new Student().$validate({
        firstName: student.firstName,
        lastName: student.lastName,
        externalId: student.externalId,
      });
      const createdStudent = await User.relatedQuery("students")
        .for(testUserId)
        .insertAndFetch(newStudentVerified);

      const courses = splitCourses(student);

      for (const course of courses) {
        const subject = await User.relatedQuery("courses")
          .for(testUserId)
          .where({ subject: course });

        if (subject.length === 0) {
          throw new Error("Student's course is not created, please create.");
        }

        await createdStudent.$relatedQuery("courses").relate(subject);
      }

      console.log(`Created student: ${student.firstName} ${student.lastName}`);
    } else {
      // console.log(
      //   `Student already exists: ${student.firstName} ${student.lastName}`
      // );
    }
  }

  // check if test assignments exist and create if don't exist

  for (const assignment of testAssignments) {
    const possibleAssignment = await User.relatedQuery("assignments")
      .for(testUserId)
      .where("name", assignment.name);

    if (possibleAssignment.length !== 1) {
      const assignmentCourse = (await User.relatedQuery("courses")
        .for(testUserId)
        .where({ subject: assignment.course })) as Course[];

      if (assignmentCourse.length > 1 || assignmentCourse.length === 0) {
        throw new Error(
          `Error in assignment course:  the length is ${assignmentCourse.length}`
        );
      }

      const newAssignmentVerfied = new Assignment().$validate({
        name: assignment.name,
        curveMethod: assignment.curveMethod,
        curveOptions: assignment.curveOptions,
        totalPoints: assignment.totalPoints,
        sheetsId: assignment.sheetsId,
        courseId: assignmentCourse[0].id,
        allGradesString: assignment.allGradesString,
      });
      await User.relatedQuery("assignments")
        .for(testUserId)
        .insert(newAssignmentVerfied);

      console.log(`Created assignment: ${assignment.name}`);
    } else {
      // console.log(`Assignment already exists: ${assignment.name}`);
    }
  }

  const returnPopulatedResults = async () => {
    const courses = (await User.relatedQuery("courses")
      .for(testUserId)
      .orderBy("subject", "ASC")) as unknown as {id: number, subject: string}[];

    const studentsQuery = `SELECT stu.id as id, stu.firstName as firstName, stu.lastName as lastName, externalId, GROUP_CONCAT(subject ORDER BY subject ASC SEPARATOR ', ') as courses from studentsCourses as sc JOIN students as stu on (sc.studentId = stu.id) JOIN courses as crs on (sc.courseId = crs.id) JOIN users on (stu.userId = users.id) WHERE users.id = ? group by stu.id ORDER BY lastName`;

    const students = (await knex.raw(studentsQuery, [testUserId]))[0] as {
      id: number,
      firstName: string,
      lastName: string,
      externalId: string,
      courses: string
    }[];

    const assignmentsQuery = `SELECT assignments.id, name, lastUpdated, curveMethod, allGradesString, subject as course from assignments JOIN courses on (courses.id = assignments.courseId) JOIN users on (assignments.userId = users.id) WHERE users.id = ? ORDER BY assignments.lastUpdated`;
    const assignments = (await knex.raw(assignmentsQuery, [testUserId]))[0] as {
      id: number;
      name: string;
      lastUpdated: string;
      curveMethod: string;
      allGradesString: string;
      course: string;
    }[];

    const userInformation = {
      userGoogleRequiredScopes: false,
      email: testUser.email
    }

    return {courses, students, assignments, userInformation} as InitializeResponse;
  };

  if (returnResults) {
    return await returnPopulatedResults();
  } else {
    return;
  }
};