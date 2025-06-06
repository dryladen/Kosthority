import { z } from "zod";
import { authProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { createClient } from "@/utils/supabase/server";
import { create } from "domain";

export const apartmentRouter = createTRPCRouter({
  list: authProcedure.query(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("apartments")
      .select(
        "id, name, description, address, gmaps, electric_number, water_number, created_at"
      );
    if (error) throw new Error(error.message);
    return data;
  }),
  create: authProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        description: z.string().optional(),
        address: z.string().min(1, "Address is required"),
        gmaps: z.string().url("Invalid Google Maps URL"),
        electric_number: z.string().optional(),
        water_number: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("apartments")
        .insert({
          user_id: ctx.supabaseUser?.id,
          name: input.name,
          description: input.description,
          address: input.address,
          gmaps: input.gmaps,
          electric_number: input.electric_number,
          water_number: input.water_number,
          created_at: new Date().toISOString(),
        })
        .select();
      if (error) throw new Error(error.message);
      return data;
    }),
  update: authProcedure
    .input(
      z.object({
        id: z.string().min(1, "ID is required"),
        name: z.string().min(1, "Name is required"),
        description: z.string().optional(),
        address: z.string().optional(),
        gmaps: z.string().url("Invalid Google Maps URL").optional(),
        electric_number: z.string().optional(),
        water_number: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("apartments")
        .update({
          name: input.name,
          description: input.description,
          address: input.address,
          gmaps: input.gmaps,
          electric_number: input.electric_number,
          water_number: input.water_number,
        })
        .eq("id", input.id)
        .select();
      if (error) throw new Error(error.message);
      return data;
    }),

});
