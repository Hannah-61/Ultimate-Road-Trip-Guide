exports.up = function (knex) {
    return knex.schema.createTable("comments", (table) => {
      table.increments("id").primary();
      table.integer("place_id").unsigned().notNullable();
      table.foreign("place_id").references("id").inTable("places").onDelete("CASCADE");
      table.string("username").notNullable();
      table.text("comment").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable("comments");
  };
  