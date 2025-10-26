import { z } from "zod";

export const campRecommendationSchema = z.object({
  targetVillageId: z.string().min(1, "Village ID is required"),
  nearestHospitals: z.array(z.string()).optional(),
  reasons: z.array(z.string()).default([]),
  severityScore: z.number().min(0),
  servicesRecommended: z.array(z.string()).default([]),
  status: z.enum(["Pending", "Approved", "Completed"]).default("Pending"),
});


