import { z } from "zod";

export const tenantSchema = z.object({
    id: z.string().min(1, "ID is required").optional(),
    name: z.string().min(1, "Name is required"),
    phone: z.string().min(1, "Phone number is required"),
    ktp_address: z.string().min(1, "KTP address is required"),
    note: z.string().optional(),
});
