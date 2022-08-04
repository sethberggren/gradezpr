import Model, { knex } from "./dbSetup";
import { Type, Static } from "@sinclair/typebox";
import { TokenExpiredError } from "jsonwebtoken";
import { Assignment } from "./Assignment";
import { Course } from "./Course";
import { Student } from "./Student";
import { UserRequest } from "./UserRequest";

const userJsonSchema = Type.Object({
  id: Type.Optional(Type.Number()),
  firstName: Type.String(),
  lastName: Type.String(),
  email: Type.String(),
  currAccessToken: Type.Optional(Type.String()),
  password: Type.String(),
  permission: Type.Optional(Type.Number()),
  googleToken: Type.Optional(Type.String()),
  loggedInWithGoogle: Type.Optional(Type.Boolean()),
});

export class User extends Model {
  id!: number;
  email!: string;
  firstName!: string;
  lastName!: string;
  password!: string;
  currAccessToken?: string;

  permission?: number;
  googleToken?: string;
  loggedInWithGoogle?: boolean;

  static jsonSchema = JSON.parse(JSON.stringify(userJsonSchema));

  static get tableName() {
    return "users";
  }

  static get idColumn() {
    return "id";
  }

  static relationMappings = () => ({
    assignments: {
      relation: Model.HasManyRelation,
      modelClass: Assignment,
      join: {
        from: "users.id",
        to: "assignments.userId",
      },
    },

    courses: {
      relation: Model.HasManyRelation,
      modelClass: Course,
      join: {
        from: "users.id",
        to: "courses.userId",
      },
    },

    students: {
      relation: Model.HasManyRelation,
      modelClass: Student,
      join: {
        from: "users.id",
        to: "students.userId",
      },
    },

    userRequests: {
      relation: Model.HasManyRelation,
      modelClass: UserRequest,
      join: {
        from: "users.id",
        to: "userRequests.userId",
      },
    },
  });
}
