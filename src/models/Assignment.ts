import Model, { knex } from "./dbSetup";
import { Type, Static } from "@sinclair/typebox";
import { TokenExpiredError } from "jsonwebtoken";
import { RelationMappings, RelationMappingsThunk } from "objection";
import { Course } from "./Course";
import { User } from "./User";
import { AssignmentResponse } from "../services/curveGrades";
import { handleKnexRawResults } from "../lib/helperFunctions";

const assignmentJsonSchema = Type.Object({
  id: Type.Optional(Type.Number()),
  name: Type.String(),
  lastUpdated: Type.Optional(Type.String()),
  curveMethod: Type.Optional(Type.String()),
  curveOptions: Type.Optional(Type.String()),
  sheetsId: Type.Optional(Type.String()),
  courseId: Type.Optional(Type.Number()),
  userId: Type.Optional(Type.Number()),
  allGradesString: Type.Optional(Type.String()),
});

export class Assignment extends Model {
  id!: number;
  name!: string;
  lastUpdated!: string;
  curveMethod?: string;
  curveOptions?: string;
  sheetsId?: string;
  courseId!: number;
  userId!: number;
  totalPoints?: number;
  allGradesString?: string;

  static jsonSchema = JSON.parse(JSON.stringify(assignmentJsonSchema));

  // $beforeInsert() {
  //   this.lastUpdated = new Date().toISOString().slice(0, 19).replace("T", " ");
  // }

  // $beforeUpdate() {
  //   this.lastUpdated = new Date().toISOString().slice(0, 19).replace("T", " ");
  // }

  static async getAssignmentsWithCourse(
    user: User
  ): Promise<AssignmentResponse[]> {
    const knex = this.knex();
    const query = `SELECT assignments.id, name, lastUpdated, curveMethod, allGradesString, subject as course from assignments JOIN courses on (courses.id = assignments.courseId) JOIN users on (assignments.userId = users.id) WHERE users.id = ? ORDER BY assignments.lastUpdated`;
    const results = await knex.raw(query, [user.id]);

    return handleKnexRawResults<AssignmentResponse[]>(results);
  }

  static async getAssignmentWithCourse(userId: number, assignmentId: number) {
    const knex = this.knex();
    const query = `SELECT assignments.id, name, lastUpdated, curveMethod, allGradesString, subject as course from assignments JOIN courses on (courses.id = assignments.courseId) JOIN users on (assignments.userId = users.id) WHERE users.id = ? AND assignments.id = ?`;
    const assignmentWithCourse = await knex.raw(query, [userId, assignmentId]);

    return assignmentWithCourse[0][0] as AssignmentResponse;
  }

  static get tableName() {
    return "assignments";
  }

  static get idColumn() {
    return "id";
  }

  static relationMappings = () => ({
    courses: {
      relation: Model.BelongsToOneRelation,
      modelClass: Course,
      join: {
        from: "assignmnents.courseId",
        to: "courses.id",
      },
    },

    users: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "assignments.userId",
        to: "users.id",
      },
    },
  });
}
