import { defaults } from "lodash";
import { Course } from "../models/Course";
import { Student } from "../models/Student";
import { User } from "../models/User";

export default async function parseRosterSheetRows(rows: string[][], userId: number) {
    const students = rows;
    let numberOfInsertedStudents = 0;
    const duplicateStudents: Student[] = [];
  
    for (const student of students) {
      const studentToInsert: {
        firstName: string;
        lastName: string;
        externalId: string;
      } = {
        lastName: student[0],
        firstName: student[1],
        externalId: student[2],
      };
  
      const studentCourses = student[3].split(",");
  
      // first, check if student is already in the user's roster
  
      const maybeStudent = (await User.relatedQuery("students")
        .for(userId)
        .where({ externalId: studentToInsert.externalId })) as Student[];
  
      if (maybeStudent.length !== 0) {
        duplicateStudents.push(maybeStudent[0]);
        continue;
      }
  
      const createdStudent = await User.relatedQuery("students")
        .for(userId)
        .insertAndFetch(new Student().$validate(studentToInsert));
  
      for (const course of studentCourses) {
        const dbCourse = (await User.relatedQuery("courses")
          .for(userId)
          .where({ subject: course.trim() })) as Course[];
  
        await createdStudent.$relatedQuery("courses").relate(dbCourse[0].id);
      }
  
      numberOfInsertedStudents++;
    }
  
    const duplicateString = duplicateStudents.reduce((prev, curr, index) => {
      if (index === 0) {
        return `${curr.firstName} ${curr.lastName}`;
      }
      return `${prev}, ${curr.firstName} ${curr.lastName}`;
    }, "");
  
    return {
      numberOfInsertedStudents: numberOfInsertedStudents,
      duplicateStudents: duplicateString,
    };
  }