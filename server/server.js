const express = require("express");
const knexConfig = require("./knexfile");
const knex = require("knex")(knexConfig.development);
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

app.use(cors());
app.use(express.json());


app.use("/images", express.static(path.join(__dirname, "images")));



async function runMigrations() {
  try {
    await knex.migrate.latest();
    console.log("Migrations applied successfully.");
  } catch (error) {
    console.error("Error running migrations:", error);
    process.exit(1);
  }
}

async function runSeeds() {
  try {
    await knex.seed.run();
    console.log("Seeds applied successfully.");
  } catch (error) {
    console.error("Error running seeds:", error);
  }
}

async function setupDatabase() {
  try {
    await runMigrations();
    await runSeeds();
  } catch (error) {
    console.error("Database setup error:", error);
    process.exit(1);
  }
}

setupDatabase();


const storage = multer.diskStorage({
  destination: "uploads/",
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

    if (response.data.candidates && response.data.candidates.length > 0) {
      return response.data.candidates[0].place_id;
    } else {
      console.warn(`No place_id found for address: ${address}`);
      return `custom_${Date.now()}`; 
    }
  } catch (error) {
    console.error("Error fetching place_id:", error);
    return `custom_${Date.now()}`; 
  }
};



app.get("/", (req, res) => {
  res.json({ message: "API is running!" });
});


app.post("/places", upload.single("image"), async (req, res, next) => {
  try {
    const { name, address, lat, lng, description, submitted_by } = req.body;

    if (!name || !address || !lat || !lng) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "https://via.placeholder.com/300";

    
    const place_id = await fetchPlaceId(address);

    
    const [id] = await knex("user_places").insert({
      name,
      address,
      lat,
      lng,
      description,
      submitted_by,
      image_url: imageUrl,
      place_id,
    });

    res.status(201).json({ id, message: "Place added successfully!", image_url: imageUrl });
  } catch (error) {
    next(error);
  }
});


app.get("/places", async (req, res, next) => {
  try {
    const places = await knex("user_places").select("*");

    
    const updatedPlaces = places.map((place) => ({
      ...place,
      image_url: place.image_url.startsWith("/uploads")
        ? `http://localhost:${PORT}${place.image_url}`
        : place.image_url,
    }));

    res.json(updatedPlaces);
  } catch (error) {
    next(error);
  }
});


app.get("/places/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const place = await knex("user_places").where({ id }).first();

    if (!place) {
      return res.status(404).json({ error: "Place not found" });
    }

    
    place.image_url = place.image_url.startsWith("/uploads")
      ? `http://localhost:${PORT}${place.image_url}`
      : place.image_url;

    res.json(place);
  } catch (error) {
    next(error);
  }
});


app.post("/comments", async (req, res, next) => {
  try {
    const { place_id, username, comment } = req.body;

    if (!place_id || !username || !comment) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const placeExists = await knex("user_places").where({ id: place_id }).first();
    if (!placeExists) {
      return res.status(400).json({ error: `Place with ID ${place_id} does not exist.` });
    }

    await knex("comments").insert({ place_id, username, comment });
    res.status(201).json({ message: "Comment added successfully!" });
  } catch (error) {
    next(error);
  }
});


app.get("/comments/:place_id", async (req, res, next) => {
  try {
    const { place_id } = req.params;
    const comments = await knex("comments").where({ place_id }).select("*");
    res.json(comments);
  } catch (error) {
    next(error);
  }
});


app.delete("/comments/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Invalid comment ID" });
    }

    console.log(`Attempting to delete comment with ID: ${id}`); 

    const deleted = await knex("comments").where({ id }).del();

    if (!deleted) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    next(error);
  }
});

app.delete("/places/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

   
    const place = await knex("user_places").where({ id }).first();
    if (!place) {
      return res.status(404).json({ error: "Place not found" });
    }

    
    if (place.image_url && place.image_url.startsWith("/uploads")) {
      const fs = require("fs");
      const imagePath = path.join(__dirname, place.image_url);
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Error deleting image:", err);
      });
    }

  
    const deleted = await knex("user_places").where({ id }).del();
    if (!deleted) {
      return res.status(404).json({ error: "Place not found" });
    }

    res.json({ message: "Place deleted successfully" });
  } catch (error) {
    next(error);
  }
});



app.use((error, req, res, next) => {
  console.error("Server Error:", error);
  res.status(500).json({ error: error.message || "Internal Server Error" });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
