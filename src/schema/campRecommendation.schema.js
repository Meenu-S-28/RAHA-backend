// import { z } from "zod";

// export const campRecommendationSchema = z.object({
//   villageId: z.string().min(1, "Village ID is required"),
//   name: z.string().min(1, "Name is required"),
//   district: z.string().min(1, "District is required"),
//   population: z.number().int().nonnegative(),
//   location: z.object({
//     type: z.literal("Point").default("Point"),
//     coordinates: z.tuple([z.number(), z.number()])
//   }),
//   accessScore: z.number().nullable().optional(),
//   nearestHospitalId: z.string().nullable().optional()
// });

// src/validators/camp.schema.js
import { z } from "zod";

export const campRecommendationSchema = z.object({
  targetVillageId: z.string().min(1, "Village ID is required"),
  nearestHospitalId: z.string().nullable().optional(),
  reason: z.string().min(1, "Reason is required"),
  severityScore: z.number().min(0),
  servicesRecommended: z.array(z.string()).default([]),
  status: z.enum(["Pending", "Approved", "Completed"]).default("Pending")
});
