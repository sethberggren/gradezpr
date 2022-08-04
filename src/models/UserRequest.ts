import Model, { knex } from "./dbSetup";
import { Type, Static } from "@sinclair/typebox";
import { TokenExpiredError } from "jsonwebtoken";
import { Assignment } from "./Assignment";
import { Course } from "./Course";
import { Student } from "./Student";
import { User } from "./User";

const userRequestJsonSchema = Type.Object({
  id: Type.Optional(Type.Number()),
  userId: Type.Optional(Type.Number()),
  requestBody: Type.String(),
  shouldBeEmailed: Type.Boolean(),
  typeOfRequest: Type.Union([Type.Literal("Bug"), Type.Literal("Feature")]),
});

export class UserRequest extends Model {
  id!: number;
  userId!: number;
  requestBody!: string;
  shouldBeEmailed!: boolean;

  static jsonSchema = JSON.parse(JSON.stringify(userRequestJsonSchema));

  static get tableName() {
    return "userRequests";
  }

  static get idColumn() {
    return "id";
  }

  static relationMappings = () => ({
    users: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "userRequests.userId",
        to: "users.id",
      },
    },
  });
}
