import Model from "./dbSetup";
import { Type } from "@sinclair/typebox";
import { RelationMappings, RelationMappingsThunk } from "objection";

const studentSectionJsonSchema= Type.Object({
  id: Type.Optional(Type.Number()),
  studentId: Type.Number(),
  courseId: Type.Number()
});

export class StudentsCourses extends Model {
  id!: number;
  studentId!: number;
  courseId!: number;

  static jsonSchema = JSON.parse(JSON.stringify(studentSectionJsonSchema));

  static get tableName() {
    return "studentsCourses";
  }

  static get idColumn() {
    return "id";
  }
}

