/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("user_places", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("address").notNullable();
    table.float("lat").notNullable();
    table.float("lng").notNullable();
    table.text("description");
    table.string("submitted_by");
    table.string("image_url").defaultTo("https://via.placeholder.com/300");
    table.string("place_id").unique().notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("user_places");
};
