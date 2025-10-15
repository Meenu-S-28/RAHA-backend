//Acts as a bridge to connect the api endpoints(routes) and the business logic(services)
import * as hospitalService from "../services/hospitals.services.js";
import { hospitalSchema } from "../schema/hospitals.schema.js";

export const getHospitals = async (req, res) => {
  try {
    const hospitals = await hospitalService.getAllHospitals();
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hospitals", error });
  }
};

export const getHospital = async (req, res) => {
  try {
    const hospital = await hospitalService.getHospitalById(req.params.hospitalId);
    if (!hospital) return res.status(404).json({ message: "Hospital not found" });
    res.json(hospital);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hospital", error });
  }
};

export const createHospital = async (req, res) => {
  try {
    const parsed = hospitalSchema.parse(req.body);
    const newHospital = await hospitalService.createHospital(parsed);
    res.status(201).json(newHospital);
  } catch (error) {
    if (error.errors) res.status(400).json({ message: "Validation failed", errors: error.errors });
    else res.status(500).json({ message: "Error adding hospital", error });
  }
};

export const updateHospital = async (req, res) => {
  try {
    const parsed = hospitalSchema.partial().parse(req.body);
    const updated = await hospitalService.updateHospital(req.params.hospitalId, parsed);
    if (!updated) return res.status(404).json({ message: "Hospital not found" });
    res.json(updated);
  } catch (error) {
    if (error.errors) res.status(400).json({ message: "Validation failed", errors: error.errors });
    else res.status(500).json({ message: "Error updating hospital", error });
  }
};

export const deleteHospital = async (req, res) => {
  try {
    const deleted = await hospitalService.deleteHospital(req.params.hospitalId);
    if (!deleted) return res.status(404).json({ message: "Hospital not found" });
    res.json({ message: "Hospital deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting hospital", error });
  }
};
