import { z } from "zod";

export const noteSchema = z.object({
    id: z.number().optional(),
    title: z.string().min(1, "Judul catatan harus diisi"),
    content: z.string().min(1, "Konten catatan harus diisi"),
    category: z.enum([
        "general",
        "maintenance",
        "tenant",
        "payment",
        "important",
        "reminder"
    ]),
    priority: z.enum(["low", "medium", "high"]),
    apartment_id: z.string().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});

export const noteCategoryLabels = {
    general: "Umum",
    maintenance: "Perawatan",
    tenant: "Penyewa",
    payment: "Pembayaran",
    important: "Penting",
    reminder: "Pengingat"
} as const;

export const notePriorityLabels = {
    low: "Rendah",
    medium: "Sedang",
    high: "Tinggi"
} as const;

export const notePriorityColors = {
    low: "bg-gray-100 text-gray-800 border-gray-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-red-100 text-red-800 border-red-200"
} as const;

export type Note = z.infer<typeof noteSchema>;
