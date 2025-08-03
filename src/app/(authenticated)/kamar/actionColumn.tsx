"use client"
import { Row } from "@tanstack/react-table";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
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
import { Room } from "@/utils/types";
import RoomForm from "./roomForm";

interface ActionColumnProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  row: Row<TData>;
}

export function ActionColumn<TData>({ row }: ActionColumnProps<TData>) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);

  const deleteRoom = api.room.delete.useMutation({
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
      await deleteRoom.mutateAsync(row.getValue("id"));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleDeleteClick = () => {
    setDeleteOpen(true);
  };

  const handleEditClick = () => {
    setUpdateOpen(true);
  };

  const roomData = row.original as Room;

  return (
    <>
      <DeleteDialog
        deleteOpen={deleteOpen}
        setDeleteOpen={setDeleteOpen}
        actionFn={handleDelete}
      />
      <RoomForm
        data={roomData}
        title="Edit Kamar"
        description="Edit data kamar"
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
            <Button
              onClick={handleEditClick}
              className="w-full justify-start h-fit border-0"
              variant="ghost"
            >
              <Edit className="h-4 w-4 mr-2" />
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
