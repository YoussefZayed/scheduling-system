import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("sessions", (table) => {
    table.increments("id").primary();
    table.dateTime("start_time").notNullable();
    table.dateTime("end_time").notNullable();
    table.string("status").notNullable();
    table.integer("student_satisfaction");
    table.text("notes");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("sessions");
}
