import { z } from "zod";

export const roomSchema = z.object({
    id: z.string().min(1, "ID is required").optional(),
    name: z.string().min(1, "Name is required"),
    status: z.string().min(1, "Status is required"),
    price: z.string().min(1, "Price is required"),
    apartment_id: z.string().min(1, "Apartment ID is required"),
});
