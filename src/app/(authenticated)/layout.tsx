import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="flex p-4 border-b-[1px] w-full">
          <SidebarTrigger />
        </div>
        <div className="p-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}
