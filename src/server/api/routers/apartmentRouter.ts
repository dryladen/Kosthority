import { z } from "zod";
import { authProcedure, createTRPCRouter } from "../trpc";
import { createClient } from "@/utils/supabase/server";
import { Apartment } from "@/utils/types";
import { apartmentSchema } from "@/utils/schemas/apartment";

export const apartmentRouter = createTRPCRouter({
  list: authProcedure.query(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("apartments")
      .select(
        "id, name, description, address, gmaps, electric_number, water_number, created_at, user_id"
      );
    if (error) throw new Error(error.message);
    return data as Apartment[];
  }),
  getById: authProcedure
    .input(z.string().min(1, "ID is required"))
    .query(async ({ input }) => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("apartments")
        .select(
          "id, name, description, address, gmaps, electric_number, water_number, created_at"
        )
        .eq("id", input)
        .single();
      if (error) throw new Error(error.message);
      return data;
    }),
  create: authProcedure
    .input(apartmentSchema)
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
    .input(apartmentSchema)
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
  delete: authProcedure
    .input(z.string().min(1, "ID is required"))
    .mutation(async ({ input }) => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("apartments")
        .delete()
        .eq("id", input)
        .select();
      if (error) throw new Error(error.message);
      return data;
    }),

});
