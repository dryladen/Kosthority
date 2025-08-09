"use client";
import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, ExternalLink, MoreHorizontal, Trash2 } from "lucide-react";
import ExpenseForm from "./expenseForm";
import { api } from "@/trpc/react";
import { Expense } from "@/utils/types";
import { useRouter } from "next/navigation";
import DeleteDialog from "@/components/form-controller/deleteDialog";

interface ActionColumnProps {
  row: Row<Expense & { apartments: { name: string } }>;
}

export default function ActionColumn({ row }: ActionColumnProps) {
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const router = useRouter();

  const deleteExpense = api.expense.delete.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const handleDelete = async () => {
    try {
      await deleteExpense.mutateAsync(String(row.getValue("id")));
    } catch (error) {
    }
  };

  const expenseData = row.original as Expense & { apartments: { name: string } };

  const handleViewReceipt = () => {
    if (expenseData.receipt_url) {
      window.open(expenseData.receipt_url, '_blank');
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setUpdateOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          {expenseData.receipt_url && (
            <DropdownMenuItem onClick={handleViewReceipt}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Lihat Bukti
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => setDeleteOpen(true)} className="text-red-600">
            <Trash2 className="h-4 w-4 mr-2" />
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ExpenseForm
        data={expenseData}
        title="Edit Pengeluaran"
        description="Edit data pengeluaran"
        modeUpdate={true}
        isUpdateOpen={updateOpen}
        setUpdateOpen={setUpdateOpen}
      />

      <DeleteDialog
        deleteOpen={deleteOpen}
        setDeleteOpen={setDeleteOpen}
        actionFn={handleDelete}
      />
    </>
  );
}
