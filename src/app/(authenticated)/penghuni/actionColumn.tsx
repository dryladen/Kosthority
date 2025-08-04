"use client"
import { Row } from "@tanstack/react-table";
import { MoreHorizontal, Edit, Trash2, CreditCard, XCircle, Ban, DollarSign } from "lucide-react";
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
import ConfirmDialog from "@/components/form-controller/confirmDialog";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { Rental } from "@/utils/types";
import Link from "next/link";
import RentalForm from "./rentalForm";

interface ActionColumnProps<TData>
    extends React.HTMLAttributes<HTMLDivElement> {
    row: Row<TData>;
}

export function ActionColumn<TData>({ row }: ActionColumnProps<TData>) {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [updateOpen, setUpdateOpen] = useState(false);
    const [terminateOpen, setTerminateOpen] = useState(false);
    const [cancelOpen, setCancelOpen] = useState(false);
    
    // Get utils for cache invalidation
    const utils = api.useUtils();    const deleteRental = api.rental.delete.useMutation({
        onSuccess: () => {
            toast.success("Data berhasil dihapus");
            // Invalidate room cache to update room status
            utils.room.list.invalidate();
            // Refresh halaman untuk update data
            window.location.reload();
        },
        onError: (error) => {
            toast.error(
                error.message || "Terjadi kesalahan saat menghapus data"
            );
        },
    });

    const terminateRental = api.rental.updateStatus.useMutation({
        onSuccess: () => {
            toast.success("Status sewa berhasil diubah");
            // Invalidate room cache to update room status
            utils.room.list.invalidate();
            // Refresh halaman untuk update data
            window.location.reload();
        },
        onError: (error) => {
            toast.error(
                error.message || "Terjadi kesalahan saat mengubah status"
            );
        },
    });

    const cancelRental = api.rental.updateStatus.useMutation({
        onSuccess: () => {
            toast.success("Kontrak sewa berhasil dibatalkan");
            // Invalidate room cache to update room status
            utils.room.list.invalidate();
            // Refresh halaman untuk update data
            window.location.reload();
        },
        onError: (error) => {
            toast.error(
                error.message || "Terjadi kesalahan saat membatalkan kontrak"
            );
        },
    });

    const handleDelete = async () => {
        try {
            await deleteRental.mutateAsync(String(row.getValue("id")));
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const handleTerminate = async () => {
        try {
            await terminateRental.mutateAsync({
                id: String(row.getValue("id")),
                status: "completed"
            });
        } catch (error) {
            console.error("Terminate error:", error);
        }
    };

    const handleCancel = async () => {
        try {
            await cancelRental.mutateAsync({
                id: String(row.getValue("id")),
                status: "cancelled"
            });
        } catch (error) {
            console.error("Cancel error:", error);
        }
    };

    const handleDeleteClick = () => {
        setDeleteOpen(true);
    };

    const handleTerminateClick = () => {
        setTerminateOpen(true);
    };

    const handleCancelClick = () => {
        setCancelOpen(true);
    };

    const handleEditClick = () => {
        setUpdateOpen(true);
    };

    const rentalData = row.original as Rental;
    const rentalId = row.getValue("id") as string;
    const isActive = rentalData.status === "active";

    return (
        <>
            <DeleteDialog
                deleteOpen={deleteOpen}
                setDeleteOpen={setDeleteOpen}
                actionFn={handleDelete}
            />
            <ConfirmDialog
                open={terminateOpen}
                setOpen={setTerminateOpen}
                actionFn={handleTerminate}
                title="Akhiri Sewa"
                description="Apakah Anda yakin ingin mengakhiri kontrak sewa ini? Status akan berubah menjadi 'Selesai' dan kamar akan tersedia untuk disewa."
                confirmText="Akhiri Sewa"
                cancelText="Batal"
                variant="warning"
            />
            <ConfirmDialog
                open={cancelOpen}
                setOpen={setCancelOpen}
                actionFn={handleCancel}
                title="Batalkan Kontrak"
                description="Apakah Anda yakin ingin membatalkan kontrak sewa ini? Aksi ini akan mengubah status menjadi 'Dibatalkan' dan kamar akan tersedia untuk disewa."
                confirmText="Batalkan"
                cancelText="Kembali"
                variant="destructive"
            />
            <RentalForm
                data={rentalData}
                title="Edit"
                description="Edit data penghuni"
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
                            href={`/tagihan?rental=${rentalId}`}
                            className="flex items-center w-full"
                            prefetch={false}
                        >
                            <CreditCard className="h-4 w-4 mr-2" />
                            <span>Lihat Tagihan</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            href={`/laporan/detail/${rentalId}`}
                            className="flex items-center w-full"
                            prefetch={false}
                        >
                            <DollarSign className="h-4 w-4 mr-2" />
                            <span>Detail Pembayaran</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Button
                            onClick={handleEditClick}
                            className="w-full justify-start h-fit border-0"
                            variant="ghost"
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            <span>Edit</span>
                        </Button>
                    </DropdownMenuItem>
                    {isActive && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Button
                                    onClick={handleTerminateClick}
                                    className="w-full justify-start h-fit border-0 text-orange-600 hover:text-orange-700"
                                    variant="ghost"
                                >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    <span>Akhiri Sewa</span>
                                </Button>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Button
                                    onClick={handleCancelClick}
                                    className="w-full justify-start h-fit border-0 text-red-600 hover:text-red-700"
                                    variant="ghost"
                                >
                                    <Ban className="h-4 w-4 mr-2" />
                                    <span>Batalkan Kontrak</span>
                                </Button>
                            </DropdownMenuItem>
                        </>
                    )}
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
