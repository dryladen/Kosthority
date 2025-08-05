"use client"
import { Row } from "@tanstack/react-table";
import { MoreHorizontal, Edit, Trash2, Receipt, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import DeleteDialog from "@/components/form-controller/deleteDialog";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { Payment } from "@/utils/types";
import PaymentForm from "./paymentForm";
import Link from "next/link";

interface ActionColumnProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  row: Row<TData>;
}

export function ActionColumn<TData>({ row }: ActionColumnProps<TData>) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);

  const deletePayment = api.payment.delete.useMutation({
    onSuccess: () => {
      toast.success("Data berhasil dihapus");
      // Refresh halaman untuk update data
      window.location.reload();
    },
    onError: (error) => {
      toast.error(
        error.message || "Terjadi kesalahan saat menghapus data"
      );
    },
  });

  const handleDelete = async () => {
    try {
      await deletePayment.mutateAsync(row.getValue("id"));
    } catch (error) {
    }
  };

  const handleDeleteClick = () => {
    setDeleteOpen(true);
  };

  const handleEditClick = () => {
    setUpdateOpen(true);
  };

  const handlePrintReceipt = () => {
    toast.info("Fitur cetak struk akan datang");
  };

  const paymentData = row.original as Payment & { 
    rentals: { 
      monthly_price: string;
      houses: { name: string; apartments: { name: string } };
      tenants: { name: string; phone: string }
    }
  };

  // Get rental_id for navigation to detail pembayaran
  const rentalId = paymentData.rental_id;

  return (
    <>
      <DeleteDialog
        deleteOpen={deleteOpen}
        setDeleteOpen={setDeleteOpen}
        actionFn={handleDelete}
      />
      <PaymentForm
        data={paymentData}
        title="Edit Pembayaran"
        description="Edit data pembayaran"
        modeUpdate={true}
        isUpdateOpen={updateOpen}
        setUpdateOpen={setUpdateOpen}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Fitur</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link
              href={`/laporan/detail/${rentalId}`}
              className="flex gap-2 font-medium items-center w-full"
              prefetch={false}
            >
              <Eye className="h-4 w-4" />
              <span>Detail Pembayaran</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Button
              onClick={handlePrintReceipt}
              className="w-full justify-start h-fit border-0"
              variant="ghost"
            >
              <Receipt className="h-4 w-4" />
              <span>Cetak Struk</span>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Button
              onClick={handleEditClick}
              className="w-full justify-start h-fit border-0"
              variant="ghost"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Button
              onClick={handleDeleteClick}
              className="w-full justify-start h-fit border-0"
              variant="destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span>Hapus</span>
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
