import { Foldable } from "fp-ts/lib/ReadonlyNonEmptyArray";
import { DownscopedClient } from "google-auth-library";
import { Knex } from "knex";
import { knex } from "../dbSetup";

interface Migration {
  name: string;
  up: (knex: Knex) => Promise<any>;
  down: (knex: Knex) => Promise<any>;
}

export const migrations: Migration[] = [
  {
    name: "initial",
    async up(knex: Knex) {
      await knex.schema.createTable("users", (table) => {
        table.increments("id").primary();
        table.string("email").notNullable().unique();
        table.string("currAccessToken");
        table.string("password").notNullable();
        table.string("firstName").notNullable();
        table.string("lastName").notNullable();
        table.string("googleToken");
        table.integer("permission").notNullable().unsigned();
        table.boolean("loggedInWithGoogle");
        table.boolean("isNewUser");
      });

      await knex.schema.createTable("courses", (table) => {
        table.increments("id").primary();
        table.string("subject").notNullable();
        table
          .integer("userId")
          .unsigned()
          .references("id")
          .inTable("users")
          .onDelete("CASCADE")
          .onUpdate("CASCADE")
          .notNullable()
          .index();
      });

      await knex.schema.createTable("students", (table) => {
        table.increments("id").primary();
        table.string("firstName").notNullable();
        table.string("lastName").notNullable();
        table.string("externalId").notNullable();
        table
          .integer("userId")
          .unsigned()
          .references("id")
          .inTable("users")
          .onDelete("CASCADE")
          .onUpdate("CASCADE")
          .notNullable()
          .index();
      });

      await knex.schema.createTable("assignments", (table) => {
        table.increments("id").primary();
        table.string("name").notNullable();
        table.timestamp("lastUpdated").defaultTo(knex.fn.now());
        table.string("sheetsId");
        table
          .integer("courseId")
          .unsigned()
          .references("id")
          .inTable("courses")
          .onDelete("CASCADE")
          .onUpdate("CASCADE")
          .notNullable()
          .index();
        table
          .integer("userId")
          .unsigned()
          .references("id")
          .inTable("users")
          .onDelete("CASCADE")
          .onUpdate("CASCADE")
          .notNullable()
          .index();
        table.float("totalPoints").notNullable();
        table.string("curveMethod");
        table.text("allGradesString");
        table.string("curveOptions");
      });

      await knex.schema.createTable("grades", (table) => {
        table.increments("id").primary();
        table.float("earnedPoints");
        table.float("curvedGrade");
        table
          .integer("studentId")
          .unsigned()
          .references("id")
          .inTable("students")
          .onDelete("CASCADE")
          .onUpdate("CASCADE")
          .notNullable()
          .index();
        table
          .integer("assignmentId")
          .unsigned()
          .references("id")
          .inTable("assignments")
          .onDelete("CASCADE")
          .onUpdate("CASCADE")
          .notNullable()
          .index();
      });

      await knex.schema.createTable("userRequests", (table) => {
        table.increments("id").primary();
        table
          .integer("userId")
          .unsigned()
          .references("id")
          .inTable("users")
          .onDelete("CASCADE")
          .onUpdate("CASCADE")
          .notNullable()
          .index();
        table.text("requestBody");
        table.boolean("shouldBeEmailed");
        table.text("typeOfRequest", "VARCHAR(255)");
      });

      await knex.schema.createTable("studentsCourses", (table) => {
        table.increments("id").primary();
        table
          .integer("studentId")
          .unsigned()
          .references("id")
          .inTable("students")
          .onDelete("CASCADE")
          .notNullable()
          .onUpdate("CASCADE")
          .index();
        table
          .integer("courseId")
          .unsigned()
          .references("id")
          .inTable("courses")
          .onDelete("CASCADE")
          .notNullable()
          .onUpdate("CASCADE")
          .index();
      });
    },
    async down(knex: Knex) {
      await knex.schema.dropSchema("gradeupdater");
    },
  },
];

const upgrade = async () => {
    migrations[0].up(knex).then(() => {
    console.log("success");
    knex.destroy();
  });
};

upgrade();
