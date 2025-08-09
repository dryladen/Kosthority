import { z } from "zod";

export const tenantSchema = z.object({
    id: z.string().min(1, "ID is required").optional(),
    name: z.string().optional(),
    phone: z.string().optional(),
    ktp_address: z.string().optional(),
    note: z.string().optional(),
});
