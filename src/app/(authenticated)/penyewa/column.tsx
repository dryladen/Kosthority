"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Tenant } from "@/utils/types";
import { ActionColumn } from "./actionColumn";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Tenant>[] = [
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
    accessorKey: "phone",
    header: "No. Telepon",
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string;
      return (
        <a 
          href={`tel:${phone}`} 
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {phone}
        </a>
      );
    },
  },
  {
    accessorKey: "ktp_address",
    header: "Alamat KTP",
    cell: ({ row }) => {
      const address = row.getValue("ktp_address") as string;
      return (
        <div className="max-w-[200px] truncate" title={address}>
          {address}
        </div>
      );
    },
  },
  {
    accessorKey: "note",
    header: "Catatan",
    cell: ({ row }) => {
      const note = row.getValue("note") as string;
      return note ? (
        <div className="max-w-[150px] truncate" title={note}>
          {note}
        </div>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
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
