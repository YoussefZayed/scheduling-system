import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("schedule_availability_blocks", (table) => {
    table.increments("id").primary();
    table
      .integer("schedule_id")
      .references("id")
      .inTable("schedules")
      .onDelete("CASCADE");
    table.dateTime("start_time").notNullable();
    table.dateTime("end_time").notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("schedule_availability_blocks");
}
