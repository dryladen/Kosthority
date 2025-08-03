import { z } from "zod";
import { authProcedure, createTRPCRouter } from "../trpc";
import { createClient } from "@/utils/supabase/server";
import { Tenant } from "@/utils/types";
import { tenantSchema } from "@/utils/schemas/tenant";

export const tenantRouter = createTRPCRouter({
  list: authProcedure.query(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tenants")
      .select("id, name, phone, ktp_address, note, created_at, user_id");
    if (error) throw new Error(error.message);
    return data as Tenant[];
  }),
  
  getById: authProcedure
    .input(z.string().min(1, "ID is required"))
    .query(async ({ input }) => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("tenants")
        .select("id, name, phone, ktp_address, note, created_at")
        .eq("id", input)
        .single();
      if (error) throw new Error(error.message);
      return data;
    }),
    
  create: authProcedure
    .input(tenantSchema)
    .mutation(async ({ ctx, input }) => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("tenants")
        .insert({
          user_id: ctx.supabaseUser?.id,
          name: input.name,
          phone: input.phone,
          ktp_address: input.ktp_address,
          note: input.note,
          created_at: new Date().toISOString(),
        })
        .select();
      if (error) throw new Error(error.message);
      return data;
    }),
    
  update: authProcedure
    .input(tenantSchema)
    .mutation(async ({ ctx, input }) => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("tenants")
        .update({
          name: input.name,
          phone: input.phone,
          ktp_address: input.ktp_address,
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
        .from("tenants")
        .delete()
        .eq("id", input)
        .select();
      if (error) throw new Error(error.message);
      return data;
    }),
});
