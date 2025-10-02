import mongoose from "mongoose";

const CampRecommendationSchema = new mongoose.Schema({
  campId: { type: String, required: true, unique: true },
  targetVillageId: { type: String, required: true },
  nearestHospitalId: { type: String, default: null },
  reason: { type: String }, // why this camp is needed
  severityScore: { type: Number, default: 0 }, // 0–1 index
  servicesRecommended: [{ type: String }], // e.g., ["OPD", "Maternal Care"]
  recommendedDate: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "approved", "completed"], default: "pending" }
});

export default mongoose.model("CampRecommendation", CampRecommendationSchema);
