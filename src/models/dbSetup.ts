import Knex from "knex";
import { Model } from "objection";
import { BUILD_TYPE, DATABASE_CXN, DATABASE_CXN_DEVELOPMENT } from "../config";

const typeCast = {
  typeCast: (field: any, next: any) => {
    if (field.type === "TINY" && field.length === 1) {
      const value = field.string();
      return value ? value === "1" : null;
    }
    return next();
  },
};

const knexOptions = {
  client: "mysql2",
  connection:
    BUILD_TYPE === "production"
      ? { ...DATABASE_CXN, ...typeCast }
      : { ...DATABASE_CXN_DEVELOPMENT, ...typeCast },
  pool: {
    // proabably need to look into this more...but for now it's working.
    // afterCreate(conn: any, cb: any) {
    //   conn.query('SET time_zone="-06:00";', (err: any) => {
    //     cb(err, conn);
    //   });
  },
};

export const knex = Knex(knexOptions);

const migrationConfig = {
  directory: __dirname + "/migrations",
};

Model.knex(knex);

export default Model;
