const places = require("./01_specialplaces.js");

exports.seed = async function (knex) {
  const existingPlaces = await knex("user_places").select("id");

  console.log(`Found ${existingPlaces.length} places in user_places.`);

  if (existingPlaces.length < 3) {
    console.log(`Not enough places found! Expected 3+, found ${existingPlaces.length}. Run the places seed first.`);
    return;
  }

  console.log("Seeding comments...");

  await knex("comments").del();

  await knex("comments").insert([
    {
      place_id: existingPlaces[0].id,
      username: "Admin",
      comment: "This coffee shop has the best cappuccino!",
    },
    {
      place_id: existingPlaces[1].id,
      username: "NatureLover",
      comment: "This park is perfect for morning walks!",
    },
    {
      place_id: existingPlaces[2].id,
      username: "Foodie",
      comment: "You have to try the seafood platter here!",
    },
  ]);

  console.log("Comments seeded successfully!");
};
