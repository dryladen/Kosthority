import { z } from "zod";
import { authProcedure, createTRPCRouter,  } from "../trpc";
import { createClient } from "@/utils/supabase/server";

export const authRouter = createTRPCRouter({
    getUser: authProcedure.query(async ({ ctx }) => {
        const supabase = await createClient();
        const { data: { user: supabaseUser } } = await supabase.auth.getUser();
        if (!supabaseUser) {
            throw new Error("User not authenticated");
        }
        return {
            id: supabaseUser.id,
            email: supabaseUser.email,
            role: supabaseUser.role
        };
    }),
});
