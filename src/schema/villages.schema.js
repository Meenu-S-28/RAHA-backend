// import { z } from "zod";

// // ---------------- Village Schema ----------------
// export const villageSchema = z.object({
//   villageId: z.string().min(1, "Village ID is required"),
//   name: z.string().min(1, "Name is required"),
//   district: z.string().min(1, "District is required"),
//   population: z.number().int().nonnegative(),
//   location: z.object({
//     type: z.literal("Point").default("Point"),
//     coordinates: z.tuple([z.number(), z.number()]) // [longitude, latitude]
//   }),
//   accessScore: z.number().nullable().optional(),
//   nearestHospitalId: z.string().nullable().optional()
// });

import { z } from "zod";

// GeoJSON point validator
const geoJSONSchema = z.object({
  type: z.literal("Point").default("Point"),
  coordinates: z
    .tuple([
      z.number().refine((val) => val >= -180 && val <= 180, {
        message: "Longitude must be between -180 and 180",
      }),
      z.number().refine((val) => val >= -90 && val <= 90, {
        message: "Latitude must be between -90 and 90",
      }),
    ])
    .refine((coords) => coords.length === 2, {
      message: "Coordinates must be an array of [longitude, latitude]",
    }),
});

export const villageSchema = z.object({
  villageId: z.string().min(1, "Village ID is required"),
  name: z.string().min(1, "Village name is required"),
  district: z.string().min(1, "District is required"),
  population: z
    .number()
    .int()
    .nonnegative({ message: "Population cannot be negative" }),
  location: geoJSONSchema,
  accessScore: z
    .number()
    .min(0, "Access score must be at least 0")
    .max(100, "Access score cannot exceed 100")
    .nullable()
    .optional(),
  nearestHospitalId: z.string().nullable().optional(),
  nearestHospitalDistance: z.number().nullable().optional(),
});

// Optional partial schema for PATCH updates
export const villageUpdateSchema = villageSchema.partial();
