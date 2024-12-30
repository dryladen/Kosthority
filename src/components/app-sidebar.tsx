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
import { signOutAction } from "@/app/actions";
import { Separator } from "./ui/separator";

// Menu items.
const items = [
  {
    title: "Beranda",
    url: "/beranda",
    icon: Home,
  },
  {
    title: "Bangunan",
    url: "/bangunan",
    icon: Building,
  },
  {
    title: "Kamar",
    url: "/kamar",
    icon: Bed,
  },
  {
    title: "Penyewa",
    url: "/penyewa",
    icon: UserRound,
  },
  {
    title: "Transaksi",
    url: "/transaksi",
    icon: ArrowRightLeft,
  },
  {
    title: "Laporan",
    url: "/laporan",
    icon: FileChartColumn,
  },
  {
    title: "Catatan",
    url: "/catatan",
    icon: NotebookText,
  },
  {
    title: "Tagihan",
    url: "/tagihan",
    icon: FileText,
  },
  {
    title: "Kalkulasi",
    url: "/kalkulasi",
    icon: Calculator,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" >
      <SidebarHeader className="p-4 border-b-[1px]">
        <span className="truncate font-semibold text-lg">Kosthority</span>
      </SidebarHeader>
      <SidebarContent >
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
                <DropdownMenuItem asChild>
                  <Link href="/profile">Akun</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <form action={signOutAction} className="w-full">
                    <button className="button block" type="submit">
                      Sign out
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
