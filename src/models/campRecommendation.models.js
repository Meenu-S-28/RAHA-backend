// import mongoose from "mongoose";

// const CampRecommendationSchema = new mongoose.Schema({
//   campId: { type: String, required: true, unique: true },
//   targetVillageId: { type: String, required: true },
//   nearestHospitalId: { type: String, default: null },
//   reason: { type: String }, // why this camp is needed
//   severityScore: { type: Number, default: 0 }, // 0–1 index
//   servicesRecommended: [{ type: String }], // e.g., ["OPD", "Maternal Care"]
//   recommendedDate: { type: Date, default: Date.now },
//   status: { type: String, enum: ["pending", "approved", "completed"], default: "pending" }
// });

// export default mongoose.model("CampRecommendation", CampRecommendationSchema);

// src/models/CampRecommendation.js
import mongoose from "mongoose";

const CampRecommendationSchema = new mongoose.Schema({
  targetVillageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Village",
    required: true
  },
  nearestHospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: false,
    default: null
  },
  reason: {
    type: String,
    required: true
  },
  severityScore: {
    type: Number,
    required: true
  },
  servicesRecommended: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Completed"],
    default: "Pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("CampRecommendation", CampRecommendationSchema);

