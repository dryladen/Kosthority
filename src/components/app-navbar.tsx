"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "./ui/sidebar";
import { Separator } from "./ui/separator";
import { ThemeSwitcher } from "./theme-switcher";

export default function AppNavbar() {
  const paths = usePathname();
  const pathNames = paths.split("/").filter((path) => path);
  return (
    <div className="flex gap-2 items-center">
      <SidebarTrigger />
      <ThemeSwitcher />
      <Separator orientation="vertical" />
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          {pathNames.map((path, index) => (
            <div key={path} className="flex items-center">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/${pathNames.slice(0, index + 1).join("/")}`}>
                    <span className="capitalize">{path}</span>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {index !== pathNames.length - 1 && (
                <BreadcrumbSeparator className="ml-3" />
              )}
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
