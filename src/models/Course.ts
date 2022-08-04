import Model, { knex } from "./dbSetup";
import { Type, Static } from "@sinclair/typebox";
import { TokenExpiredError } from "jsonwebtoken";
import { User } from "./User";
import { Assignment } from "./Assignment";
import { Student } from "./Student";

const courseJsonSchema = Type.Object({
  id: Type.Optional(Type.Number()),
  subject: Type.String(),
  userId: Type.Optional(Type.Number()),
});

export class Course extends Model {
  id!: number;
  subject!: string;
  userId!: number;

  static jsonSchema = JSON.parse(JSON.stringify(courseJsonSchema));

  static get tableName() {
    return "courses";
  }

  static get idColumn() {
    return "id";
  }

  static relationMappings = () => ({
    users: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "courses.userId",
        to: "users.id",
      },
    },

    assignments: {
      relation: Model.HasManyRelation,
      modelClass: Assignment,
      join: {
        from: "courses.id",
        to: "assignments.courseId",
      },
    },

    students: {
      relation: Model.ManyToManyRelation,
      modelClass: Student,
      join: {
        from: "courses.id",
        through: {
          from: "studentsCourses.courseId",
          to: "studentsCourses.studentId",
        },
        to: "students.id",
      },
    },
  });
}
