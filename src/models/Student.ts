import Model from "./dbSetup";
import { Type } from "@sinclair/typebox";
import { User } from "./User";
import { Course } from "./Course";
import { StudentResponse } from "../http/routes/students/studentsRoute";
import { handleKnexRawResults } from "../lib/helperFunctions";

const studentJsonSchema = Type.Object({
  id: Type.Optional(Type.Number()),
  firstName: Type.String(),
  lastName: Type.String(),
  externalId: Type.String(),
  userId: Type.Optional(Type.Number()),
});

export class Student extends Model {
  id!: number;
  firstName!: string;
  lastName!: string;
  externalId!: string;
  userId!: number;

  static jsonSchema = JSON.parse(JSON.stringify(studentJsonSchema));

  static get tableName() {
    return "students";
  }

  static async getStudentsWithCourses(user: User): Promise<StudentResponse[]> {
    const knex = this.knex();
    const query = `SELECT stu.id as id, stu.firstName as firstName, stu.lastName as lastName, externalId, GROUP_CONCAT(subject ORDER BY subject ASC SEPARATOR ', ') as courses from studentsCourses as sc JOIN students as stu on (sc.studentId = stu.id) JOIN courses as crs on (sc.courseId = crs.id) JOIN users on (stu.userId = users.id) WHERE users.id = ? group by stu.id ORDER BY lastName`;
    const results = await knex.raw(query, [user.id]);
    return handleKnexRawResults<StudentResponse[]>(results);
  }

  static async getStudentByExternalId(
    user: User,
    externalId: string
  ): Promise<StudentResponse> {
    const knex = this.knex();
    const query = `SELECT stu.id as id, stu.firstName as firstName, stu.lastName as lastName, externalId, GROUP_CONCAT(subject ORDER BY subject ASC SEPARATOR ', ') as courses from studentsCourses as sc JOIN students as stu on (sc.studentId = stu.id) JOIN courses as crs on (sc.courseId = crs.id) JOIN users on (stu.userId = users.id) WHERE users.id = ? AND stu.externalId = ? group by stu.id`;
    return (await knex.raw(query, [user.id, externalId]))[0][0];
  }

  static get idColumn() {
    return "id";
  }

  static relationMappings = () => ({
    users: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "students.userId",
        to: "users.id",
      },
    },

    courses: {
      relation: Model.ManyToManyRelation,
      modelClass: Course,
      join: {
        from: "students.id",
        through: {
          from: "studentsCourses.studentId",
          to: "studentsCourses.courseId",
        },
        to: "courses.id",
      },
    },
  });
}
