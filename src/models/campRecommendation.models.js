import mongoose from "mongoose";

const CampRecommendationSchema = new mongoose.Schema({
  targetVillageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Village",
    required: true,
  },
  nearestHospitals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: false,
    },
  ],
  reasons: {
    type: [String],
    default: [],
  },
  severityScore: {
    type: Number,
    required: true,
  },
  servicesRecommended: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Completed"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("CampRecommendation", CampRecommendationSchema);

