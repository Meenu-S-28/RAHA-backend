
import express from "express";
import {
  getVillages,
  getVillage,
  createVillage,
  updateVillage,
  deleteVillage,
} from "../controllers/villageController.js";

const router = express.Router();

// REST API Endpoints
router.get("/", getVillages);          // GET all
router.get("/:id", getVillage);        // GET one
router.post("/", createVillage);       // POST create
router.put("/:id", updateVillage);     // PUT update
router.delete("/:id", deleteVillage);  // DELETE

export default router;

