import express from "express";
import {
  generateCamps,
  getAllCamps,
  updateCampStatus
} from "../controllers/campController.js";

const router = express.Router();

router.post("/generate", generateCamps);
router.get("/", getAllCamps);
router.put("/:id", updateCampStatus);

export default router;
