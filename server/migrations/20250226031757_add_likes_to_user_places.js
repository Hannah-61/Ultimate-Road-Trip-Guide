/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.alterTable("user_places", function (table) {
      table.integer("likes").defaultTo(0);
    });
  };

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

  exports.down = function (knex) {
    return knex.schema.alterTable("user_places", function (table) {
      table.dropColumn("likes");
    });
  };