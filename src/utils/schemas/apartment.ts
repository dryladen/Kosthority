import { z } from "zod";

export const apartmentSchema = z.object({
    id: z.string().min(1, "ID is required").optional(),
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    address: z.string().min(1, "Address is required").optional(),
    gmaps: z.string().optional(),
    electric_number: z.string().optional(),
    water_number: z.string().optional(),
});