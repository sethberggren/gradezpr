import Knex from "knex";
import { Model } from "objection";
import { BUILD_TYPE, DATABASE_CXN, DATABASE_CXN_DEVELOPMENT } from "../config";

console.log(BUILD_TYPE);

const knexOptions = {
  client: "mysql2",
  connection:
    BUILD_TYPE === "production" ? DATABASE_CXN : DATABASE_CXN_DEVELOPMENT,
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
