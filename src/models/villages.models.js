import mongoose from "mongoose";

const VillageSchema = new mongoose.Schema({
  villageId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  district: { type: String, required: true },
  population: { type: Number, required: true },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  accessScore: { type: Number, default: null },       // computed later
  nearestHospitalId: { type: String, default: null }  // computed later
});

// Geo index for spatial queries
VillageSchema.index({ location: "2dsphere" });

export default mongoose.model("Village", VillageSchema);

