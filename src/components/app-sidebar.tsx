import {
  ArrowRightLeft,
  Bed,
  Building,
  Calculator,
  ChevronUp,
  FileChartColumn,
  FileText,
  Home,
  NotebookText,
  User2,
  UserRound,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";

// Menu items.
const items = [
  {
    title: "Beranda",
    url: "#",
    icon: Home,
  },
  {
    title: "Bangunan",
    url: "#",
    icon: Building,
  },
  {
    title: "Kamar",
    url: "#",
    icon: Bed,
  },
  {
    title: "Penyewa",
    url: "#",
    icon: UserRound,
  },
  {
    title: "Transaksi",
    url: "#",
    icon: ArrowRightLeft,
  },
  {
    title: "Laporan",
    url: "#",
    icon: FileChartColumn,
  },
  {
    title: "Catatan",
    url: "#",
    icon: NotebookText,
  },
  {
    title: "Tagihan",
    url: "#",
    icon: FileText,
  },
  {
    title: "Kalkulasi",
    url: "#",
    icon: Calculator,
  },
];

export function AppSidebar() {
  
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <span className="truncate font-semibold text-lg">Kosthority</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> Username
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Akun</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
