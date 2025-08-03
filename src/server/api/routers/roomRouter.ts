import { z } from "zod";
import { authProcedure, createTRPCRouter } from "../trpc";
import { createClient } from "@/utils/supabase/server";
import { Room } from "@/utils/types";
import { roomSchema } from "@/utils/schemas/room";

export const roomRouter = createTRPCRouter({
  list: authProcedure.query(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("houses")
      .select(`
        id, 
        name, 
        status, 
        price, 
        apartment_id,
        created_at,
        apartments!inner(name)
      `);
    if (error) throw new Error(error.message);
    return data as unknown as (Room & { apartments: { name: string } })[];
  }),
  
  getById: authProcedure
    .input(z.string().min(1, "ID is required"))
    .query(async ({ input }) => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("houses")
        .select(`
          id, 
          name, 
          status, 
          price, 
          apartment_id,
          created_at,
          apartments!inner(name)
        `)
        .eq("id", input)
        .single();
      if (error) throw new Error(error.message);
      return data as unknown as Room & { apartments: { name: string } };
    }),
    
  getByApartmentId: authProcedure
    .input(z.string().min(1, "Apartment ID is required"))
    .query(async ({ input }) => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("houses")
        .select(`
          id, 
          name, 
          status, 
          price, 
          apartment_id,
          created_at
        `)
        .eq("apartment_id", input);
      if (error) throw new Error(error.message);
      return data as Room[];
    }),
    
  create: authProcedure
    .input(roomSchema)
    .mutation(async ({ ctx, input }) => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("houses")
        .insert({
          user_id: ctx.supabaseUser?.id,
          name: input.name,
          status: input.status,
          price: input.price,
          apartment_id: input.apartment_id,
          created_at: new Date().toISOString(),
        })
        .select();
      if (error) throw new Error(error.message);
      return data;
    }),
    
  update: authProcedure
    .input(roomSchema)
    .mutation(async ({ ctx, input }) => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("houses")
        .update({
          name: input.name,
          status: input.status,
          price: input.price,
          apartment_id: input.apartment_id,
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
        .from("houses")
        .delete()
        .eq("id", input)
        .select();
      if (error) throw new Error(error.message);
      return data;
    }),
});
