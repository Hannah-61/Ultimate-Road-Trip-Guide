/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.alterTable("user_places", function (table) {
      table.string("place_id").unique().notNullable(); 
    });
  };

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.alterTable("user_places", function (table) {
      table.dropColumn("place_id");
    });
  };