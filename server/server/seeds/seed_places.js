/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
 
  await knex("user_places").del();


  const imagePath = "/images/museumPhotos/";

  await knex("user_places").insert([
    {
      name: "Museum of Illusions Toronto",
      address: "132 Front St E, Toronto, ON M5A 1E2, Canada",
      lat: 43.6501123,
      lng: -79.3696318,
      description: "A fascinating museum featuring optical illusions and mind-bending exhibits.",
      submitted_by: "admin",
      image_url: `${imagePath}1.avif`,
      place_id: "ChIJsxk7YljL1IkRqehKLUOWlUM"
    },
    {
      name: "Royal Ontario Museum",
      address: "100 Queens Park, Toronto, ON M5S 2C6, Canada",
      lat: 43.6677097,
      lng: -79.3947771,
      description: "One of the largest museums in North America, featuring art, culture, and natural history exhibits.",
      submitted_by: "admin",
      image_url: `${imagePath}2.jpg`,
      place_id: "ChIJE-Xa87o0K4gRkvXFHuE0hMk"
    },
    {
      name: "The Miller Museum Of Geology",
      address: "Queen's University, Miller Hall, 36 Union St, Kingston, ON K7L 2N8, Canada",
      lat: 44.2274001,
      lng: -76.4927957,
      description: "A geological museum showcasing rock, mineral, and fossil collections.",
      submitted_by: "admin",
      image_url: `${imagePath}3.jpg`,
      place_id: "ChIJC1_GogOr0kwRniCiLJE_wmM"
    },
    {
      name: "Canadian Museum of History",
      address: "100 Laurier St, Gatineau, Quebec K1A 0M8, Canada",
      lat: 45.4301581,
      lng: -75.7092006,
      description: "A museum highlighting Canada's cultural and historical heritage.",
      submitted_by: "admin",
      image_url: `${imagePath}4.jpg`,
      place_id: "ChIJL-0QIPEEzkwRxPx5idTJaKo"
    },
    {
      name: "Canada Science and Technology Museum",
      address: "1867 St. Laurent Blvd, Ottawa, ON K1G 5A3, Canada",
      lat: 45.4035099,
      lng: -75.6189059,
      description: "A museum showcasing Canada's achievements in science and technology.",
      submitted_by: "admin",
      image_url: `${imagePath}5.jpg`,
      place_id: "ChIJO8pWMg4PzkwRP0X3kCcAp3c"
    },
    {
      name: "Montreal Museum of Archaeology and History",
      address: "350 Place Royale, Montreal, Quebec H2Y 3Y5, Canada",
      lat: 45.5026511,
      lng: -73.5541668,
      description: "A museum dedicated to the archaeology and history of Montreal.",
      submitted_by: "admin",
      image_url: `${imagePath}6.jpg`,
      place_id: "ChIJy4EMO1gayUwR9Edi1pVv934"
    }
  ]);
};
