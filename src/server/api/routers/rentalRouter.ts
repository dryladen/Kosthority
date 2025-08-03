import { z } from "zod";
import { authProcedure, createTRPCRouter } from "../trpc";
import { createClient } from "@/utils/supabase/server";
import { Rental } from "@/utils/types";
import { rentalSchema } from "@/utils/schemas/rental";

export const rentalRouter = createTRPCRouter({
  list: authProcedure.query(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("rentals")
      .select(`
        id, 
        house_id, 
        tenant_id, 
        move_in, 
        move_out, 
        monthly_price, 
        note, 
        created_at,
        houses!inner(name, apartments!inner(name)),
        tenants!inner(name, phone)
      `);
    if (error) throw new Error(error.message);
    return data as unknown as (Rental & { 
      houses: { name: string; apartments: { name: string } };
      tenants: { name: string; phone: string }
    })[];
  }),
  
  getById: authProcedure
    .input(z.string().min(1, "ID is required"))
    .query(async ({ input }) => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("rentals")
        .select(`
          id, 
          house_id, 
          tenant_id, 
          move_in, 
          move_out, 
          monthly_price, 
          note, 
          created_at,
          house_id!inner(name, apartments!inner(name)),
          tenants!inner(name, phone)
        `)
        .eq("id", input)
        .single();
      if (error) throw new Error(error.message);
      return data as unknown as Rental & { 
        house: { name: string; apartments: { name: string } };
        tenants: { name: string; phone: string }
      };
    }),
    
  getByTenantId: authProcedure
    .input(z.string().min(1, "Tenant ID is required"))
    .query(async ({ input }) => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("rentals")
        .select(`
          id, 
          house_id, 
          tenant_id, 
          move_in, 
          move_out, 
          monthly_price, 
          note, 
          created_at,
          houses!inner(house_id)
        `)
        .eq("tenant_id", input);
      if (error) throw new Error(error.message);
      return data as unknown as (Rental & { house: { name: string } })[];
    }),
    
  create: authProcedure
    .input(rentalSchema)
    .mutation(async ({ ctx, input }) => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("rentals")
        .insert({
          user_id: ctx.supabaseUser?.id,
          house_id: input.house_id,
          tenant_id: input.tenant_id,
          move_in: input.move_in,
          move_out: input.move_out,
          monthly_price: input.monthly_price,
          note: input.note,
          created_at: new Date().toISOString(),
        })
        .select();
      if (error) throw new Error(error.message);
      return data;
    }),
    
  update: authProcedure
    .input(rentalSchema)
    .mutation(async ({ ctx, input }) => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("rentals")
        .update({
          house_id: input.house_id,
          tenant_id: input.tenant_id,
          move_in: input.move_in,
          move_out: input.move_out,
          monthly_price: input.monthly_price,
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
        .from("rentals")
        .delete()
        .eq("id", input)
        .select();
      if (error) throw new Error(error.message);
      return data;
    }),
});
