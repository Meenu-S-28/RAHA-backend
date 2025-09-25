import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "../src/config/db.js"; // adjust path if needed
import Village from "../src/models/Village.js";
import Hospital from "../src/models/Hospital.js";
import villages from "../src/data/villages.json" assert { type: "json" };
import hospitals from "../src/data/hospitals.json" assert { type: "json" };

async function seed() {
  await connectDB();
  await Village.deleteMany({});
  await Hospital.deleteMany({});
  await Village.insertMany(villages);
  await Hospital.insertMany(hospitals);
  console.log("Seeded DB");
  process.exit();
}
seed();
