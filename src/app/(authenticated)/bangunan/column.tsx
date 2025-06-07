"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ActionColumn } from "./actionColumn";
import { Apartment } from "@/utils/types";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Apartment>[] = [
  {
    accessorKey: "id",
    header: "ID",
    meta: {
      className: "hidden",
    },
  },
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "description",
    header: "Deskripsi",
  },
  {
    accessorKey: "address",
    header: "Alamat",
  },
  {
    accessorKey: "electric_number",
    header: "Nomor Listrik",
  },
  {
    accessorKey: "water_number",
    header: "Nomor Air",
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
