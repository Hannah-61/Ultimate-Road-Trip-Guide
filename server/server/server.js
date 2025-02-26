const express = require("express");
const knexConfig = require("./knexfile");
const knex = require("knex")(knexConfig.development);
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;


app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/images", express.static(path.join(__dirname, "images")));


const ensureUploadsFolder = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");
    ensureUploadsFolder(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });


const fetchPlaceId = async (address) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json`,
      {
        params: {
          input: address,
          inputtype: "textquery",
          fields: "place_id",
          key: GOOGLE_MAPS_API_KEY,
        },
      }
    );

    return response.data.candidates.length > 0
      ? response.data.candidates[0].place_id
      : `custom_${Date.now()}`;
  } catch (error) {
    return `custom_${Date.now()}`;
  }
};


(async () => {
  try {
    await knex.migrate.latest();
    await knex.seed.run();
    console.log("Database setup complete.");

    await knex("user_places")
      .whereNot("image_url", "like", "[%]")
      .update({
        image_url: knex.raw("CONCAT('[\"', image_url, '\"]')"),
      });
    console.log(" Database records updated to JSON format.");
  } catch (error) {
    console.error("Database setup error:", error);
    process.exit(1);
  }
})();


app.get("/", (req, res) => {
  res.json({ message: "API is running!" });
});


app.post("/places", upload.array("images", 5), async (req, res) => {
  try {
    const { name, address, description, submitted_by } = req.body;
    let { lat, lng } = req.body;

    if (!name || !address || !lat || !lng) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    lat = parseFloat(lat);
    lng = parseFloat(lng);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: "Latitude and longitude must be numbers." });
    }

    const imageUrls = JSON.stringify(
      req.files.map((file) => `/uploads/${file.filename}`)
    );
    const place_id = await fetchPlaceId(address);

    const [id] = await knex("user_places").insert({
      name,
      address,
      lat,
      lng,
      description,
      submitted_by,
      image_url: imageUrls,
      place_id,
      likes: 0,
    });

    const newPlace = await knex("user_places").where({ id }).first();
    newPlace.image_urls = JSON.parse(newPlace.image_url).map(
      (url) => `http://localhost:${PORT}${url}`
    );

    res.status(201).json(newPlace);
  } catch (error) {
    console.error(" Error adding place:", error);
    res.status(500).json({ error: "Failed to add place" });
  }
});


app.get("/places", async (req, res) => {
  try {
    console.log("🔍 Fetching places...");
    const places = await knex("user_places").select("*");

    if (!places.length) {
      console.warn(" No places found.");
      return res.status(404).json({ error: "No places found" });
    }

    const updatedPlaces = places.map((place) => ({
      ...place,
      image_urls:
        place.image_url && place.image_url.startsWith("[")
          ? JSON.parse(place.image_url).map(
              (url) => `http://localhost:${PORT}${url}`
            )
          : [`http://localhost:${PORT}${place.image_url}`],
    }));

    console.log("Places retrieved:", updatedPlaces);
    res.json(updatedPlaces);
  } catch (error) {
    console.error("Error fetching places:", error);
    res.status(500).json({ error: "Failed to fetch places" });
  }
});


app.get("/places/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const place = await knex("user_places").where("id", "=", id).first();
    

    if (!place) {
      return res.status(404).json({ error: "Place not found" });
    }

    place.image_urls =
      place.image_url && place.image_url.startsWith("[")
        ? JSON.parse(place.image_url).map(
            (url) => `http://localhost:${PORT}${url}`
          )
        : [`http://localhost:${PORT}${place.image_url}`];

    res.json(place);
  } catch (error) {
    console.error("rror fetching place:", error);
    res.status(500).json({ error: "Failed to fetch place" });
  }
});




app.post("/places/:id/like", async (req, res) => {
  try {
    const { id } = req.params;
    const place = await knex("user_places").where({ id }).first();
    if (!place) return res.status(404).json({ error: "Place not found" });

    const updatedLikes = (place.likes || 0) + 1;
    await knex("user_places").where({ id }).update({ likes: updatedLikes });

    res.json({ message: "Place liked!", likes: updatedLikes });
  } catch (error) {
    console.error("Error liking place:", error);
    res.status(500).json({ error: "Failed to like place" });
  }
});


app.delete("/comments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await knex("comments").where({ id }).first();
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    await knex("comments").where({ id }).del();
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error(" Error deleting comment:", error);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});


app.use((error, req, res, next) => {
  console.error("Server Error:", error);
  res.status(500).json({ error: error.message || "Internal Server Error" });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
