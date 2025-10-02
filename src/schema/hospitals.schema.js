import { z } from "zod";

export const hospitalSchema = z.object({
  hospitalId: z.string().min(1, "Hospital ID is required"),
  name: z.string().min(1, "Name is required"),
  type: z.enum(["District Hospital", "PHC", "Clinic", "Charitable Hospital"]),
  district: z.string().min(1, "District is required"),
  doctors: z.number().int().nonnegative().default(0),
  beds: z.number().int().nonnegative().default(0),
  services: z.array(z.string()).default([]),
  admissionFee: z.number().nonnegative().default(0),
  location: z.object({
    type: z.literal("Point").default("Point"),
    coordinates: z.tuple([z.number(), z.number()])
  }),
  lastUpdated: z.date().default(() => new Date())
});