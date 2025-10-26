import CampRecommendation from "../models/campRecommendation.models.js";
import { generateCampRecommendations } from "../services/campRecommendation.services.js";

export const generateCamps = async (req, res) => {
  try {
    const result = await generateCampRecommendations();
    res.json({
      message: "Camp recommendations generated successfully",
      count: result.summary.total,
      data: result.recommendations,
    });
  } catch (error) {
    res.status(500).json({ message: "Error generating camps", error });
  }
};

export const getAllCamps = async (req, res) => {
  try {
    const camps = await CampRecommendation.find()
      .populate("targetVillageId", "name district population")
      .populate("nearestHospitals", "name district doctors beds");
    res.json(camps);
  } catch (error) {
    res.status(500).json({ message: "Error fetching camps", error });
  }
};

export const updateCampStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const camp = await CampRecommendation.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!camp) return res.status(404).json({ message: "Camp not found" });
    res.json(camp);
  } catch (error) {
    res.status(500).json({ message: "Error updating camp", error });
  }
};
