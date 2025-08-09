import { z } from "zod";

export const expenseSchema = z.object({
    id: z.string().min(1, "ID is required").optional(),
    apartment_id: z.string().min(1, "Apartment ID is required"),
    category: z.enum([
        "electricity", 
        "water", 
        "maintenance", 
        "repair", 
        "cleaning", 
        "supplies", 
        "tax", 
        "insurance",
        "other"
    ]).default("other"),
    description: z.string().min(1, "Description is required"),
    amount: z.string().min(1, "Amount is required"),
    expense_date: z.string().min(1, "Expense date is required"),
    meter_reading_before: z.string().optional(),
    meter_reading_after: z.string().optional(),
    receipt_url: z.string().url("Invalid URL format").optional().or(z.literal("")),
    note: z.string().optional(),
});

export const expenseCategoryLabels = {
    electricity: "Listrik",
    water: "Air", 
    maintenance: "Perawatan",
    repair: "Perbaikan",
    cleaning: "Kebersihan",
    supplies: "Perlengkapan",
    tax: "Pajak",
    insurance: "Asuransi",
    other: "Lainnya"
} as const;
