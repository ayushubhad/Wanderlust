const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const dbUrl = process.env.ATLAS_DB_URL;
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

async function main() {
  if (!dbUrl) {
    throw new Error("ATLAS_DB_URL is not defined in your .env file!");
  }
  await mongoose.connect(dbUrl);
  console.log("Connected to MongoDB Atlas");
}

const validCategories = [
  "Trending", "Rooms", "Iconic Cities", "Mountains", "Castles",
  "Pools", "Camping", "Farms", "Arctic", "Beach",
  "Vineyards", "Kitchen", "GameHub", "Nature", "Business",
  "Vacation", "Music"
];

const formatCategory = (category) => {
  if (!category || typeof category !== "string") return "Rooms";
  let clean = category.replace(/-/g, " ").trim();
  const categoryMap = {
    "Pool": "Pools",
    "Room": "Rooms",
    "Mountain": "Mountains",
    "Castle": "Castles",
    "Farm": "Farms",
    "Vineyard": "Vineyards"
  };
  if (categoryMap[clean]) clean = categoryMap[clean];
  const matched = validCategories.find(
    (c) => c.toLowerCase() === clean.toLowerCase()
  );
  return matched || "Rooms";
};

const initDB = async () => {
  try {
    await main();

    // Clear old listings
    await Listing.deleteMany({});

    console.log("Geocoding listings and preparing data...");

    // Geocode each listing asynchronously
    const updatedData = await Promise.all(
      initData.data.map(async (obj) => {
        let geometry = { type: "Point", coordinates: [72.8777, 19.076] };

        // Query Mapbox using location and country
        try {
          const searchQuery = `${obj.location}, ${obj.country}`;
          const response = await geocodingClient
            .forwardGeocode({
              query: searchQuery,
              limit: 1,
            })
            .send();

          if (
            response.body.features &&
            response.body.features.length > 0 &&
            response.body.features[0].geometry
          ) {
            geometry = response.body.features[0].geometry;
          }
        } catch (geoErr) {
          console.warn(`Could not geocode "${obj.location}":`, geoErr.message);
        }

        return {
          ...obj,
          category: formatCategory(obj.category),
          owner: "6a8098cd60ed8d1361006d0b", // Your valid User _id
          image: {
            url: typeof obj.image === "object" ? obj.image.url : obj.image,
            filename: "wanderlust_DEV/seed_image",
          },
          geometry: geometry,
        };
      })
    );

    await Listing.insertMany(updatedData);
    console.log("Local listings with dynamic map coordinates imported to Atlas!");
  } catch (err) {
    console.error("Migration Error:", err);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

initDB();