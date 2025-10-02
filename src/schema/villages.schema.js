import { z } from "zod";

// ---------------- Village Schema ----------------
export const villageSchema = z.object({
  villageId: z.string().min(1, "Village ID is required"),
  name: z.string().min(1, "Name is required"),
  district: z.string().min(1, "District is required"),
  population: z.number().int().nonnegative(),
  location: z.object({
    type: z.literal("Point").default("Point"),
    coordinates: z.tuple([z.number(), z.number()]) // [longitude, latitude]
  }),
  accessScore: z.number().nullable().optional(),
  nearestHospitalId: z.string().nullable().optional()
});