import { SidebarProvider} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import AppNavbar from "@/components/app-navbar";


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="flex p-4 border-b-[1px] w-full">
          <AppNavbar />
        </div>
        <div className="p-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}
