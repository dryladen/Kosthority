import { z } from "zod";
import { createTRPCRouter, authProcedure } from "@/server/api/trpc";
import { noteSchema } from "@/utils/schemas/note";
import { createClient } from "@/utils/supabase/server";

export const noteRouter = createTRPCRouter({
    // Get all notes
    list: authProcedure.query(async () => {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("notes")
            .select(`
        *,
        apartments:apartment_id(name)
      `)
            .order("created_at", { ascending: false });

        if (error) {
            throw new Error(`Failed to fetch notes: ${error.message}`);
        }

        return data || [];
    }),

    // Get note by ID
    byId: authProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input }) => {
            const supabase = await createClient();

            const { data, error } = await supabase
                .from("notes")
                .select(`
          *,
          apartments:apartment_id(name)
        `)
                .eq("id", input.id)
                .single();

            if (error) {
                throw new Error(`Failed to fetch note: ${error.message}`);
            }

            return data;
        }),

    // Create new note
    create: authProcedure
        .input(noteSchema.omit({ id: true, created_at: true, updated_at: true }))
        .mutation(async ({ ctx, input }) => {
            const supabase = await createClient();

            const { data, error } = await supabase
                .from("notes")
                .insert({
                    user_id: ctx.supabaseUser?.id,
                    title: input.title,
                    content: input.content,
                    category: input.category,
                    priority: input.priority,
                    apartment_id: input.apartment_id || null,
                })
                .select()
                .single();

            if (error) {
                throw new Error(`Failed to create note: ${error.message}`);
            }

            return data;
        }),

    // Update note
    update: authProcedure
        .input(noteSchema.required({ id: true }))
        .mutation(async ({ input }) => {
            const supabase = await createClient();

            const { data, error } = await supabase
                .from("notes")
                .update({
                    title: input.title,
                    content: input.content,
                    category: input.category,
                    priority: input.priority,
                    apartment_id: input.apartment_id || null,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", input.id)
                .select()
                .single();

            if (error) {
                throw new Error(`Failed to update note: ${error.message}`);
            }

            return data;
        }),

    // Delete note
    delete: authProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
            const supabase = await createClient();

            const { error } = await supabase
                .from("notes")
                .delete()
                .eq("id", input.id);

            if (error) {
                throw new Error(`Failed to delete note: ${error.message}`);
            }

            return { success: true };
        }),

    // Get notes by category
    byCategory: authProcedure
        .input(z.object({
            category: z.enum(["general", "maintenance", "tenant", "payment", "important", "reminder"])
        }))
        .query(async ({ input }) => {
            const supabase = await createClient();

            const { data, error } = await supabase
                .from("notes")
                .select(`
          *,
          apartments:apartment_id(name)
        `)
                .eq("category", input.category)
                .order("created_at", { ascending: false });

            if (error) {
                throw new Error(`Failed to fetch notes by category: ${error.message}`);
            }

            return data || [];
        }),

    // Get notes by priority
    byPriority: authProcedure
        .input(z.object({
            priority: z.enum(["low", "medium", "high"])
        }))
        .query(async ({ input }) => {
            const supabase = await createClient();

            const { data, error } = await supabase
                .from("notes")
                .select(`
          *,
          apartments:apartment_id(name)
        `)
                .eq("priority", input.priority)
                .order("created_at", { ascending: false });

            if (error) {
                throw new Error(`Failed to fetch notes by priority: ${error.message}`);
            }

            return data || [];
        }),
});
