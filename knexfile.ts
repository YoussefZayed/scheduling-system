import { Knex } from "knex";

const config: Knex.Config = {
  client: "sqlite3",
  connection: {
    filename: "./dev.sqlite3",
  },
  useNullAsDefault: true,
};

export default config;
