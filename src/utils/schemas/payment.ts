import { z } from "zod";

export const paymentSchema = z.object({
    id: z.number().min(1, "ID is required").optional(),
    rental_id: z.number().min(1, "Rental ID is required"),
    amount: z.string().min(1, "Amount is required"),
    note: z.string().optional(),
    for_month: z.string()
        .min(1, "Month is required")
        .regex(/^\d{4}-\d{2}$/, "Format bulan harus YYYY-MM"),
});
