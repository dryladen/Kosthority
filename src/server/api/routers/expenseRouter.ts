import { z } from "zod";
import { authProcedure, createTRPCRouter } from "../trpc";
import { createClient } from "@/utils/supabase/server";
import { Expense } from "@/utils/types";
import { expenseSchema } from "@/utils/schemas/expense";

export const expenseRouter = createTRPCRouter({
  list: authProcedure.query(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("expenses")
      .select(`
        id,
        apartment_id,
        category,
        description,
        amount,
        expense_date,
        meter_reading_before,
        meter_reading_after,
        receipt_url,
        note,
        created_at,
        apartments!inner(name)
      `)
      .order('expense_date', { ascending: false });
    if (error) throw new Error(error.message);
    return data as unknown as (Expense & { apartments: { name: string } })[];
  }),

  getByApartmentId: authProcedure
    .input(z.string().min(1, "Apartment ID is required"))
    .query(async ({ input }) => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("expenses")
        .select(`
          id,
          apartment_id,
          category,
          description,
          amount,
          expense_date,
          meter_reading_before,
          meter_reading_after,
          receipt_url,
          note,
          created_at
        `)
        .eq("apartment_id", input)
        .order('expense_date', { ascending: false });
      if (error) throw new Error(error.message);
      return data as Expense[];
    }),

  getById: authProcedure
    .input(z.string().min(1, "ID is required"))
    .query(async ({ input }) => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("expenses")
        .select(`
          id,
          apartment_id,
          category,
          description,
          amount,
          expense_date,
          meter_reading_before,
          meter_reading_after,
          receipt_url,
          note,
          created_at,
          apartments!inner(name)
        `)
        .eq("id", input)
        .single();
      if (error) throw new Error(error.message);
      return data as unknown as Expense & { apartments: { name: string } };
    }),

  create: authProcedure
    .input(expenseSchema)
    .mutation(async ({ ctx, input }) => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("expenses")
        .insert({
          user_id: ctx.supabaseUser?.id,
          apartment_id: input.apartment_id,
          category: input.category,
          description: input.description,
          amount: input.amount,
          expense_date: input.expense_date,
          meter_reading_before: input.meter_reading_before,
          meter_reading_after: input.meter_reading_after,
          receipt_url: input.receipt_url,
          note: input.note,
          created_at: new Date().toISOString(),
        })
        .select();
      if (error) throw new Error(error.message);
      return data;
    }),

  update: authProcedure
    .input(expenseSchema)
    .mutation(async ({ input }) => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("expenses")
        .update({
          apartment_id: input.apartment_id,
          category: input.category,
          description: input.description,
          amount: input.amount,
          expense_date: input.expense_date,
          meter_reading_before: input.meter_reading_before,
          meter_reading_after: input.meter_reading_after,
          receipt_url: input.receipt_url,
          note: input.note,
        })
        .eq("id", input.id)
        .select();
      if (error) throw new Error(error.message);
      return data;
    }),

  delete: authProcedure
    .input(z.string().min(1, "ID is required"))
    .mutation(async ({ input }) => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("expenses")
        .delete()
        .eq("id", input)
        .select();
      if (error) throw new Error(error.message);
      return data;
    }),

  // Get monthly expenses report for an apartment
  monthlyReport: authProcedure
    .input(z.object({
      apartment_id: z.string().min(1, "Apartment ID is required"),
      year: z.number().min(2020).max(2030),
      month: z.number().min(1).max(12)
    }))
    .query(async ({ input }) => {
      const supabase = await createClient();
      
      const startDate = new Date(input.year, input.month - 1, 1).toISOString().split('T')[0];
      const endDate = new Date(input.year, input.month, 0).toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from("expenses")
        .select("category, description, amount, expense_date, note")
        .eq("apartment_id", input.apartment_id)
        .gte("expense_date", startDate)
        .lte("expense_date", endDate)
        .order('expense_date', { ascending: false });
        
      if (error) throw new Error(error.message);
      
      const totalExpenses = data?.reduce((sum, expense) => sum + parseFloat(expense.amount), 0) || 0;
      
      const expensesByCategory = data?.reduce((acc, expense) => {
        const category = expense.category;
        if (!acc[category]) {
          acc[category] = { total: 0, count: 0, items: [] };
        }
        acc[category].total += parseFloat(expense.amount);
        acc[category].count++;
        acc[category].items.push(expense);
        return acc;
      }, {} as Record<string, { total: number; count: number; items: typeof data }>);
      
      return {
        totalExpenses,
        expensesByCategory: expensesByCategory || {},
        expenses: data || []
      };
    }),
});
