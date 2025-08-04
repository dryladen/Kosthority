"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Rental } from "@/utils/types";
import { Badge } from "@/components/ui/badge";
import { ActionColumn } from "./actionColumn";

// This type is used to define the shape of our data.
type RentalWithRelations = Rental & { 
  houses: { name: string; apartments: { name: string } };
  tenants: { name: string; phone: string }
};

export const columns: ColumnDef<RentalWithRelations>[] = [
  {
    accessorKey: "id",
    header: "ID",
    meta: {
      className: "hidden",
    },
  },
  {
    accessorKey: "tenants.name",
    id: "tenantName",
    header: "Penyewa",
    cell: ({ row }) => {
      const tenant = row.original.tenants;
      return (
        <div>
          <div className="font-medium">{tenant?.name || "N/A"}</div>
          <div className="text-sm text-muted-foreground">{tenant?.phone || ""}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "house.name",
    header: "Kamar",
    cell: ({ row }) => {
      const house = row.original.houses;
      return (
        <div>
          <div className="font-medium">{house.name || "N/A"}</div>
          <div className="text-sm text-muted-foreground">{house?.apartments?.name || ""}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "move_in",
    header: "Masuk",
    cell: ({ row }) => {
      const moveIn = new Date(row.getValue("move_in"));
      const formattedDate = moveIn.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      return <span>{formattedDate}</span>;
    },
  },
  {
    accessorKey: "move_out",
    header: "Keluar",
    cell: ({ row }) => {
      const moveOut = new Date(row.getValue("move_out"));
      const today = new Date();
      const isExpired = moveOut < today;
      
      const formattedDate = moveOut.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      
      return (
        <div className="flex items-center gap-2">
          <span>{formattedDate}</span>
          {isExpired && (
            <Badge variant="destructive" className="text-xs">
              Expired
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "monthly_price",
    header: "Harga/Bulan",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("monthly_price"));
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(price);
      return <span>{formatted}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusLabels = {
        active: "Aktif",
        completed: "Selesai",
        terminated: "Dihentikan",
        cancelled: "Dibatalkan"
      };
      
      const statusColors = {
        active: "bg-green-100 text-green-800",
        completed: "bg-blue-100 text-blue-800",
        terminated: "bg-orange-100 text-orange-800",
        cancelled: "bg-red-100 text-red-800"
      };
      
      return (
        <Badge 
          variant="secondary" 
          className={statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}
        >
          {statusLabels[status as keyof typeof statusLabels] || status}
        </Badge>
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
    id: "actions",
    cell: ({ row }) => {
      return <ActionColumn row={row} />;
    },
  },
];
