import { z } from "zod";
import { authProcedure, createTRPCRouter } from "../trpc";
import { createClient } from "@/utils/supabase/server";
import { Payment } from "@/utils/types";
import { paymentSchema } from "@/utils/schemas/payment";

export const paymentRouter = createTRPCRouter({
    list: authProcedure.query(async () => {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("payments")
            .select(`
        id, 
        rental_id, 
        amount, 
        note, 
        for_month, 
        created_at,
        rentals!inner(
          monthly_price,
          houses!inner(name, apartments!inner(name)),
          tenants!inner(name, phone)
        )
      `)
            .order('for_month', { ascending: false });
        if (error) throw new Error(error.message);
        return data as unknown as (Payment & {
            rentals: {
                monthly_price: string;
                houses: { name: string; apartments: { name: string } };
                tenants: { name: string; phone: string }
            }
        })[];
    }),

    getById: authProcedure
        .input(z.string().min(1, "ID is required"))
        .query(async ({ input }) => {
            const supabase = await createClient();
            const { data, error } = await supabase
                .from("payments")
                .select(`
          id, 
          rental_id, 
          amount, 
          note, 
          for_month, 
          created_at,
          rentals!inner(
            monthly_price,
            houses!inner(name, apartments!inner(name)),
            tenants!inner(name, phone)
          )
        `)
                .eq("id", input)
                .single();
            if (error) throw new Error(error.message);
            return data as unknown as Payment & {
                rentals: {
                    monthly_price: string;
                    houses: { name: string };
                    tenants: { name: string; phone: string }
                }
            };
        }),

    getByRentalId: authProcedure
        .input(z.string().min(1, "Rental ID is required"))
        .query(async ({ input }) => {
            const supabase = await createClient();
            const { data, error } = await supabase
                .from("payments")
                .select(`
          id, 
          rental_id, 
          amount, 
          note, 
          for_month, 
          created_at
        `)
                .eq("rental_id", input)
                .order('for_month', { ascending: false });
            if (error) throw new Error(error.message);
            return data as Payment[];
        }),

    create: authProcedure
        .input(paymentSchema)
        .mutation(async ({ ctx, input }) => {
            const supabase = await createClient();
            const { data, error } = await supabase
                .from("payments")
                .insert({
                    user_id: ctx.supabaseUser?.id,
                    rental_id: input.rental_id,
                    amount: input.amount,
                    note: input.note,
                    for_month: input.for_month,
                    created_at: new Date().toISOString(),
                })
                .select();
            if (error) throw new Error(error.message);
            return data;
        }),

    update: authProcedure
        .input(paymentSchema)
        .mutation(async ({ ctx, input }) => {
            const supabase = await createClient();
            const { data, error } = await supabase
                .from("payments")
                .update({
                    rental_id: input.rental_id,
                    amount: input.amount,
                    note: input.note,
                    for_month: input.for_month,
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
                .from("payments")
                .delete()
                .eq("id", input)
                .select();
            if (error) throw new Error(error.message);
            return data;
        }),
});
