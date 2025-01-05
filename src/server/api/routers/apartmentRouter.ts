import { z } from "zod";
import { authProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { createClient } from "@/utils/supabase/server";

// Mocked DB
interface Post {
  id: number;
  name: string;
}
const posts: Post[] = [
  {
    id: 1,
    name: "Hello World",
  },
];

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
});
