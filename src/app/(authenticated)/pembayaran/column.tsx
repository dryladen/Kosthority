"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Payment } from "@/utils/types";
import { Badge } from "@/components/ui/badge";
import { ActionColumn } from "./actionColumn";

// This type is used to define the shape of our data.
type PaymentWithRelations = Payment & { 
  rentals: { 
    monthly_price: string;
    houses: { name: string; apartments: { name: string } };
    tenants: { name: string; phone: string }
  }
};

export const columns: ColumnDef<PaymentWithRelations>[] = [
  {
    accessorKey: "id",
    header: "ID",
    meta: {
      className: "hidden",
    },
  },
  {
    accessorKey: "rentals.tenants.name",
    header: "Penyewa",
    id: "tenantName",
    cell: ({ row }) => {
      const rental = row.original.rentals;
      return (
        <div>
          <div className="font-medium">{rental?.tenants?.name || "N/A"}</div>
          <div className="text-sm text-muted-foreground">{rental?.tenants?.phone || ""}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "rentals.houses.name",
    header: "Kamar",
    cell: ({ row }) => {
      const rental = row.original.rentals;
      return (
        <div>
          <div className="font-medium">{rental?.houses?.name || "N/A"}</div>
          <div className="text-sm text-muted-foreground">{rental?.houses?.apartments?.name || ""}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "for_month",
    header: "Bulan",
    cell: ({ row }) => {
      const forMonth = new Date(row.getValue("for_month"));
      const formattedMonth = forMonth.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
      });
      return <span>{formattedMonth}</span>;
    },
  },
  {
    accessorKey: "amount",
    header: "Jumlah Bayar",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const monthlyPrice = parseFloat(row.original.rentals?.monthly_price || "0");
      
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(amount);
      
      const isFullPayment = amount >= monthlyPrice;
      
      return (
        <div className="flex items-center gap-2">
          <span>{formatted}</span>
          {!isFullPayment && (
            <Badge variant="secondary" className="text-xs">
              Cicilan
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "rentals.monthly_price",
    header: "Target/Bulan",
    cell: ({ row }) => {
      const monthlyPrice = parseFloat(row.original.rentals?.monthly_price || "0");
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(monthlyPrice);
      return <span className="text-muted-foreground">{formatted}</span>;
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
    header: "Tanggal Bayar",
    cell: ({ row }) => {
      const created_at = new Date(row.getValue("created_at"));
      const formattedDate = created_at.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
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
