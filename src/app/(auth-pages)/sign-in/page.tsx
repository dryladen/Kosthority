import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <main className="min-h-screen flex flex-col w-full justify-center items-center ">
      <div className=" w-full flex  gap-16 items-center justify-center">
        <div className="flex flex-col gap-20 max-w-5xl p-5">
          <form className="flex-1 flex flex-col min-w-64">
            <h1 className="text-2xl font-medium">Masuk</h1>
            <p className="text-sm text-foreground">
              Belum punya akun ?{" "}
              <Link
                className="text-foreground font-medium underline"
                href="/sign-up"
              >
                Daftar
              </Link>
            </p>
            <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
              <Label htmlFor="email">Email</Label>
              <Input name="email" placeholder="you@example.com" required />
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  className="text-xs text-foreground underline"
                  href="/forgot-password"
                >
                  Forgot Password?
                </Link>
              </div>
              <Input
                type="password"
                name="password"
                placeholder="Your password"
                required
              />
              <SubmitButton
                pendingText="Signing In..."
                formAction={signInAction}
              >
                Sign in
              </SubmitButton>
              <FormMessage message={searchParams} />
            </div>
          </form>
        </div>
        
      </div>
    </main>
  );
}
