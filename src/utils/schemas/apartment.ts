import { z } from "zod";

export const apartmentSchema = z.object({
    id: z.string().optional(),
    name: z.string().nonempty(),
    description: z.string(),
    address: z.string(),
    gmaps: z.string(),
    electric_number: z.string(),
    water_number: z.string(),
});