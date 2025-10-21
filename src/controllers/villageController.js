//Acts as a bridge to connect the api endpoints(routes) and the business logic(services)
import { villageSchema } from "../schema/villages.schema.js";
import * as villageService from "../services/villages.services.js";

export const getVillages = async (req, res) => {
  try {
    const villages = await villageService.getAllVillages();
    res.status(200).json(villages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching villages", error });
  }
};

export const getVillage = async (req, res) => {
  try {
    const village = await villageService.getVillageByVillageId(req.params.id);
    if (!village) return res.status(404).json({ message: "Village not found" });
    res.status(200).json(village);
  } catch (error) {
    res.status(500).json({ message: "Error fetching village", error });
  }
};

export const createVillage = async (req, res) => {
  try {
    const parsed = villageSchema.parse(req.body);
    const newVillage = await villageService.createVillage(parsed);
    res.status(201).json(newVillage);
  } catch (error) {
    if (error.errors) {
      res.status(400).json({ message: "Validation failed", errors: error.errors });
    } else {
      res.status(500).json({ message: "Error creating village", error });
    }
  }
};

export const updateVillage = async (req, res) => {
  try {
    const parsed = villageSchema.partial().parse(req.body); // allow partial updates
    const updated = await villageService.updateVillage(req.params.id, parsed);
    if (!updated) return res.status(404).json({ message: "Village not found" });
    res.status(200).json(updated);
  } catch (error) {
    if (error.errors) {
      res.status(400).json({ message: "Validation failed", errors: error.errors });
    } else {
      res.status(500).json({ message: "Error updating village", error });
    }
  }
};

export const deleteVillage = async (req, res) => {
  try {
    const deleted = await villageService.deleteVillage(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Village not found" });
    res.status(200).json({ message: "Village deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting village", error });
  }
};

export const assignNearestHospitals = async (req, res) => {
  try {
    const result = await villageService.assignNearestHospitalsToVillages();
    res.status(200).json({
      message: "Nearest hospitals assigned successfully!",
      ...result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};