import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import villagesModels from "../models/villages.models.js";
import hospitalsModels from "../models/hospitals.models.js";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read JSON files
const villages = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/villages.json"), "utf-8")
);

const hospitals = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/hospitals.json"), "utf-8")
);
const MONGO_URI = process.env.MONGO_URI;
async function seed() {
  try {
    await mongoose.connect(MONGO_URI);

    await villagesModels.deleteMany();
    await hospitalsModels.deleteMany();

    await villagesModels.insertMany(villages);
    await hospitalsModels.insertMany(hospitals);

    console.log("✅ Seeding complete!");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding:", err);
    process.exit(1);
  }
}

seed();

