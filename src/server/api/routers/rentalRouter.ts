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
        status,
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
  }),  getById: authProcedure
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
          status,
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
          status,
          note,
          created_at,
          houses!inner(house_id)
        `)
        .eq("tenant_id", input);
      if (error) throw new Error(error.message);
      return data as unknown as (Rental & { house: { name: string } })[];
    }),  create: authProcedure
    .input(rentalSchema)
    .mutation(async ({ ctx, input }) => {
      const supabase = await createClient();
      
      // Start transaction-like operations
      // First, create the rental
      const { data, error } = await supabase
        .from("rentals")
        .insert({
          user_id: ctx.supabaseUser?.id,
          house_id: input.house_id,
          tenant_id: input.tenant_id,
          move_in: input.move_in,
          move_out: input.move_out,
          monthly_price: input.monthly_price,
          status: input.status || "active",
          note: input.note,
          created_at: new Date().toISOString(),
        })
        .select();
      
      if (error) throw new Error(error.message);
      
      // Then, update the room status to 'occupied'
      const { error: roomUpdateError } = await supabase
        .from("houses")
        .update({ status: "occupied" })
        .eq("id", input.house_id);
      
      if (roomUpdateError) {
        // If room update fails, we should ideally rollback the rental creation
        // But since Supabase doesn't support transactions in this way,
        // we'll throw an error and let the user retry
        throw new Error(`Gagal mengupdate status kamar: ${roomUpdateError.message}`);
      }
      
      return data;
    }),
    
  update: authProcedure
    .input(rentalSchema)
    .mutation(async ({ ctx, input }) => {
      const supabase = await createClient();
      
      // Get the old rental data to check if house_id changed
      const { data: oldRental, error: fetchError } = await supabase
        .from("rentals")
        .select("house_id")
        .eq("id", input.id)
        .single();
      
      if (fetchError) throw new Error(fetchError.message);
      
      // Update the rental
      const { data, error } = await supabase
        .from("rentals")
        .update({
          house_id: input.house_id,
          tenant_id: input.tenant_id,
          move_in: input.move_in,
          move_out: input.move_out,
          monthly_price: input.monthly_price,
          status: input.status,
          note: input.note,
        })
        .eq("id", input.id)
        .select();
      
      if (error) throw new Error(error.message);
      
      // If house_id changed, update room statuses
      if (oldRental.house_id !== input.house_id) {
        // Set old room back to available
        const { error: oldRoomError } = await supabase
          .from("houses")
          .update({ status: "available" })
          .eq("id", oldRental.house_id);
        
        if (oldRoomError) {
          throw new Error(`Gagal mengupdate status kamar lama: ${oldRoomError.message}`);
        }
        
        // Set new room to occupied
        const { error: newRoomError } = await supabase
          .from("houses")
          .update({ status: "occupied" })
          .eq("id", input.house_id);
        
        if (newRoomError) {
          throw new Error(`Gagal mengupdate status kamar baru: ${newRoomError.message}`);
        }
      }
      
      return data;
    }),
    
  // Instead of delete, we change status
  updateStatus: authProcedure
    .input(z.object({
      id: z.string().min(1, "ID is required"),
      status: z.enum(["active", "completed", "terminated", "cancelled"])
    }))
    .mutation(async ({ input }) => {
      const supabase = await createClient();
      
      // Get the rental data first to know which room to update
      const { data: rental, error: fetchError } = await supabase
        .from("rentals")
        .select("house_id, status")
        .eq("id", input.id)
        .single();
      
      if (fetchError) throw new Error(fetchError.message);
      
      // Update the rental status
      const { data, error } = await supabase
        .from("rentals")
        .update({ status: input.status })
        .eq("id", input.id)
        .select();
      
      if (error) throw new Error(error.message);
      
      // Update room status based on rental status
      let newRoomStatus = "available";
      if (input.status === "active") {
        newRoomStatus = "occupied";
      } else if (['completed', 'terminated', 'cancelled'].includes(input.status)) {
        newRoomStatus = "available";
      }
      
      // Only update room status if it changed from active to inactive or vice versa
      if ((rental.status === "active" && input.status !== "active") || 
          (rental.status !== "active" && input.status === "active")) {
        const { error: roomUpdateError } = await supabase
          .from("houses")
          .update({ status: newRoomStatus })
          .eq("id", rental.house_id);
        
        if (roomUpdateError) {
          throw new Error(`Gagal mengupdate status kamar: ${roomUpdateError.message}`);
        }
      }
      
      return data;
    }),

  // Keep delete for admin purposes, but usually we should use updateStatus instead
  delete: authProcedure
    .input(z.string().min(1, "ID is required"))
    .mutation(async ({ input }) => {
      const supabase = await createClient();
      
      // Get the rental data first to know which room to update
      const { data: rental, error: fetchError } = await supabase
        .from("rentals")
        .select("house_id")
        .eq("id", input)
        .single();
      
      if (fetchError) throw new Error(fetchError.message);
      
      // Delete the rental
      const { data, error } = await supabase
        .from("rentals")
        .delete()
        .eq("id", input)
        .select();
      
      if (error) throw new Error(error.message);
      
      // Update the room status back to 'available'
      const { error: roomUpdateError } = await supabase
        .from("houses")
        .update({ status: "available" })
        .eq("id", rental.house_id);
      
      if (roomUpdateError) {
        throw new Error(`Gagal mengupdate status kamar: ${roomUpdateError.message}`);
      }
      
      return data;
    }),
});
