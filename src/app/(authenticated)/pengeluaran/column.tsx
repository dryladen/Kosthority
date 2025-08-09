"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Expense } from "@/utils/types";
import { Badge } from "@/components/ui/badge";
import { expenseCategoryLabels } from "@/utils/schemas/expense";
import ActionColumn from "./actionColumn";

export const columns: ColumnDef<Expense & { apartments: { name: string } }>[] = [
  {
    accessorKey: "expense_date",
    header: ({ column }) => (
      <button
        className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Tanggal</span>
      </button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("expense_date"));
      const formattedDate = date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      return <div className="font-medium">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "apartments.name",
    header: "Bangunan",
    cell: ({ row }) => {
      const apartmentName = row.original.apartments?.name;
      return <span className="font-medium">{apartmentName}</span>;
    },
  },
  {
    accessorKey: "category",
    header: "Kategori",
    id: "category",
    cell: ({ row }) => {
      const category = row.getValue("category") as keyof typeof expenseCategoryLabels;
      const label = expenseCategoryLabels[category];
      
      const badgeColors = {
        electricity: "bg-yellow-100 text-yellow-800",
        water: "bg-blue-100 text-blue-800", 
        maintenance: "bg-green-100 text-green-800",
        repair: "bg-red-100 text-red-800",
        cleaning: "bg-purple-100 text-purple-800",
        supplies: "bg-gray-100 text-gray-800",
        tax: "bg-orange-100 text-orange-800",
        insurance: "bg-indigo-100 text-indigo-800",
        other: "bg-gray-100 text-gray-800"
      };
      
      return (
        <Badge className={badgeColors[category] || badgeColors.other}>
          {label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Deskripsi",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <div className="max-w-[300px]">
          <p className="truncate font-medium">{description}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Jumlah",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(amount);
      return <div className="font-medium text-red-600">{formatted}</div>;
    },
  },
  {
    accessorKey: "meter_reading_before",
    header: "Meteran",
    cell: ({ row }) => {
      const before = row.original.meter_reading_before;
      const after = row.original.meter_reading_after;
      const category = row.getValue("category") as string;
      
      if (!before || !after || (category !== "electricity" && category !== "water")) {
        return <span className="text-muted-foreground">-</span>;
      }
      
      const usage = parseFloat(after) - parseFloat(before);
      const unit = category === "electricity" ? "kWh" : "m³";
      
      return (
        <div className="text-sm">
          <p className="font-medium">{usage} {unit}</p>
          <p className="text-muted-foreground">{before} → {after}</p>
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
    header: "Dibuat",
    cell: ({ row }) => {
      const created_at = new Date(row.getValue("created_at"));
      const formattedDate = created_at.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      return <div className="text-muted-foreground">{formattedDate}</div>;
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => <ActionColumn row={row} />,
  },
];
