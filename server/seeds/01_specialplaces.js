/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {

  await knex("places").del();


  await knex("places").insert([
    {
      name: "Best Coffee Shop",
      type: "coffee_shop",
      lat: 45.4230,
      lng: -75.6950,
      address: "123 Coffee St, Ottawa, ON, Canada",
      description: "Try their signature espresso!",
      website: "https://coffeeshop.com",
      place_id: "some-google-place-id",
    },
    {
      name: "Favorite Park",
      type: "park",
      lat: 45.4202,
      lng: -75.6900,
      address: "456 Park Lane, Ottawa, ON, Canada",
      description: "Great place for a morning walk!",
      website: "https://parkwebsite.com",
      place_id: "some-google-place-id",
    },
    {
      name: "Top Restaurant",
      type: "restaurant",
      lat: 45.4190,
      lng: -75.6935,
      address: "789 Food Ave, Ottawa, ON, Canada",
      description: "Amazing seafood dishes!",
      website: "https://toprestaurant.com",
      place_id: "some-google-place-id",
    },
  ]);
};
