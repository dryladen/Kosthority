import { createClient } from "@/utils/supabase/server";

type Options<T> = {
	queryFn: {
		(): Promise<T>;
	};
	serverErrorMessage?: string;
	isProtected?: boolean;
};

export async function executeQuery<T>({
	queryFn,
	serverErrorMessage = "Error executing query",
	isProtected = true,
}: Options<T>) {
	try {
		if (isProtected) {
			const supabase = await createClient();
			const session = supabase.auth.getSession();
			if (!session) throw new Error("Not authorized");
		}
		return await queryFn();
	} catch (error) {
		return null;
	}
}