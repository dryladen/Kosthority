"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ActionColumn } from "./actionColumn";
import { Room } from "@/utils/types";
import { Badge } from "@/components/ui/badge";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

type RoomWithApartment = Room & { apartments: { name: string } };

export const columns: ColumnDef<RoomWithApartment>[] = [
  {
    accessorKey: "id",
    header: "ID",
    meta: {
      className: "hidden",
    },
  },
  {
    accessorKey: "name",
    header: "Nama Kamar",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant = status === "available" ? "default" : 
                    status === "occupied" ? "destructive" : 
                    status === "maintenance" ? "secondary" : "outline";
      
      const displayStatus = status === "available" ? "Tersedia" :
                           status === "occupied" ? "Terisi" :
                           status === "maintenance" ? "Maintenance" : status;
      
      return <Badge variant={variant}>{displayStatus}</Badge>;
    },
  },
  {
    accessorKey: "price",
    header: "Harga",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(price);
      return <span>{formatted}</span>;
    },
  },
  {
    accessorKey: "apartments.name",
    header: "Bangunan",
    cell: ({ row }) => {
      const apartment = row.original.apartments;
      return <span>{apartment?.name || "N/A"}</span>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Tanggal dibuat",
    cell: ({ row }) => {
      const created_at = new Date(row.getValue("created_at"));
      const formattedDate = created_at.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return <span>{formattedDate}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <ActionColumn row={row} />;
    },
  },
];
