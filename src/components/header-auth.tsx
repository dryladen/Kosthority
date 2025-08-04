import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import { ThemeSwitcher } from "./theme-switcher";

const AuthButton = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-4">
      <ThemeSwitcher />
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/beranda">Beranda</Link>
      </Button>
    </div>
  ) : (
    <div className="flex gap-4">
      <ThemeSwitcher />
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Masuk</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Daftar</Link>
      </Button>
    </div>
  );
}

export default AuthButton;
