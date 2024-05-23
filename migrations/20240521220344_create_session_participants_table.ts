import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("session_participants", (table) => {
    table
      .integer("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .integer("session_id")
      .references("id")
      .inTable("sessions")
      .onDelete("CASCADE");
    table.string("role").notNullable();
    table
      .string("phone_number_id")
      .references("id")
      .inTable("user_phone_numbers");
    table.primary(["user_id", "session_id"]);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("session_participants");
}
