import { SidebarProvider} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import AppNavbar from "@/components/app-navbar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";


export default async function Layout({ children }: { children: React.ReactNode }) {
  // const supabase = await createClient();
  // const { data, error } = await supabase.auth.getUser()
  // if (error || !data?.user) {
  //   redirect('/sign-in')
  // }
  return (
    <SidebarProvider>
      <AppSidebar email={"Username"} />
      <main className="w-full">
        <div className="flex p-4 border-b-[1px] w-full">
          <AppNavbar />
        </div>
        <div className="p-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}
