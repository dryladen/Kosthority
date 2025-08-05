"use client";
import {
  ArrowRightLeft,
  Bed,
  Building,
  Calculator,
  ChevronUp,
  CircleUser,
  FileChartColumn,
  FileText,
  Home,
  LogOut,
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
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

// Menu items - Dikelompokkan berdasarkan kategori
const menuGroups = [
  {
    label: "Utama",
    items: [
      {
        title: "Beranda",
        url: "/beranda",
        icon: Home,
      },
    ]
  },
  {
    label: "Operasional",
    items: [
      {
        title: "Penghuni",
        url: "/penghuni",
        icon: ArrowRightLeft,
      },
      {
        title: "Pembayaran",
        url: "/pembayaran",
        icon: FileText,
      },
    ]
  },
  {
    label: "Data Master",
    items: [
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
    ]
  },
  {
    label: "Manajemen",
    items: [
      {
        title: "Laporan",
        url: "/laporan",
        icon: FileChartColumn,
      },
      {
        title: "Kalkulasi",
        url: "/kalkulasi",
        icon: Calculator,
      },
      {
        title: "Catatan",
        url: "/catatan",
        icon: NotebookText,
      },
    ]
  }
];

type Props = {
  email: string | undefined;
};
export function AppSidebar({email} : Props) {
  const pathname = usePathname();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 border-b-[1px]">
        <span className="truncate font-semibold text-lg">Kosthority</span>
      </SidebarHeader>
      <SidebarContent>
        {menuGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={pathname === item.url}
                    >
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
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {email}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem
                  asChild
                  className={
                    "cursor-pointer text-sidebar-foreground hover:bg-sidebar-accent"
                  }
                >
                  <Link href="/profile" className="flex gap-2">
                    <CircleUser size={16} /> Akun
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <form action={signOutAction} className="w-full">
                    <button
                      className="button flex gap-2 w-full text-start text-sidebar-foreground "
                      type="submit"
                    >
                      <LogOut size={16} />
                      Log out
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
