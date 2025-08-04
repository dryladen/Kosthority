import { z } from "zod";

export const rentalSchema = z.object({
    id: z.string().min(1, "ID is required").optional(),
    house_id: z.string().min(1, "House ID is required"),
    tenant_id: z.string().min(1, "Tenant ID is required"),
    move_in: z.string().min(1, "Move in date is required"),
    move_out: z.string().min(1, "Move out date is required"),
    monthly_price: z.string().min(1, "Monthly price is required"),
    status: z.enum(["active", "completed", "terminated", "cancelled"]).default("active"),
    note: z.string().optional(),
});
