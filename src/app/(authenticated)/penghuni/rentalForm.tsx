"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/form-controller/input";
import { LoaderCircle, PlusCircle } from "lucide-react";
import { useState } from "react";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { z } from "zod";
import { api } from "@/trpc/react";
import { rentalSchema } from "@/utils/schemas/rental";
import { Rental } from "@/utils/types";
import { toast } from "sonner";
import SelectBox from "@/components/form-controller/selectionBox";

type Props = {
  data?: Rental;
  title: string;
  description: string;
  modeUpdate: boolean;
  isUpdateOpen?: boolean;
  setUpdateOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

const RentalForm = ({
  data,
  title,
  description,
  modeUpdate,
  isUpdateOpen,
  setUpdateOpen,
}: Props) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch rooms and tenants for selection
  const { data: rooms, isLoading: roomsLoading } = api.room.list.useQuery();
  const { data: tenants, isLoading: tenantsLoading } = api.tenant.list.useQuery();

  // Get utils for cache invalidation
  const utils = api.useUtils();

  const form = useForm<z.infer<typeof rentalSchema>>({
    resolver: zodResolver(rentalSchema),
    defaultValues: !modeUpdate ? {
      house_id: "",
      tenant_id: "",
      move_in: "",
      move_out: "",
      monthly_price: "",
      status: "active",
      note: "",
    } : {
      id: data?.id || undefined,
      house_id: data?.house_id || "",
      tenant_id: data?.tenant_id || "",
      move_in: data?.move_in ? new Date(data.move_in).toISOString().split('T')[0] : "",
      move_out: data?.move_out ? new Date(data.move_out).toISOString().split('T')[0] : "",
      monthly_price: data?.monthly_price || "",
      status: data?.status || "active",
      note: data?.note || "",
    },
  });

  const updateRental = api.rental.update.useMutation({
    onSuccess: () => {
      toast.success("Data berhasil diperbarui");
      form.reset();
      setUpdateOpen ? setUpdateOpen(false) : setIsOpen(false);
      router.refresh();
      // Invalidate room cache to update room status
      utils.room.list.invalidate();
      setLoading(false);
    },
    onError: (error) => {
      toast.error(`Gagal memperbarui data: ${error.message}`);
      setLoading(false);
    },
  });

  const createRental = api.rental.create.useMutation({
    onSuccess: () => {
      toast.success("Data berhasil ditambahkan");
      form.reset();
      setUpdateOpen ? setUpdateOpen(false) : setIsOpen(false);
      router.refresh();
      // Invalidate room cache to update room status
      utils.room.list.invalidate();
      setLoading(false);
    },
    onError: (error) => {
      toast.error(`Gagal menambah data: ${error.message}`);
      setLoading(false);
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof rentalSchema>> = async (formData) => {
    setLoading(true);

    try {
      if (modeUpdate) {
        if (!formData.id) {
          throw new Error("ID is required for update");
        }
        await updateRental.mutateAsync({
          id: formData.id,
          house_id: formData.house_id,
          tenant_id: formData.tenant_id,
          move_in: formData.move_in,
          move_out: formData.move_out,
          monthly_price: formData.monthly_price,
          status: formData.status,
          note: formData.note,
        });
      } else {
        await createRental.mutateAsync({
          house_id: formData.house_id,
          tenant_id: formData.tenant_id,
          move_in: formData.move_in,
          move_out: formData.move_out,
          monthly_price: formData.monthly_price,
          status: formData.status,
          note: formData.note,
        });
      }
    } catch (error) {
      setLoading(false);
    }
  }; const handleButtonClick = () => {
    setIsOpen(true);
  };

  return (
    <>
      <ResponsiveDialog
        isOpen={modeUpdate ? isUpdateOpen : isOpen}
        setIsOpen={modeUpdate ? setUpdateOpen : setIsOpen}
        title={title}
        description={description}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectBox
                control={form.control}
                name="tenant_id"
                options={
                  tenants?.map((tenant) => ({
                    id: tenant.id,
                    name: `${tenant.name} - ${tenant.phone}`,
                  })) || []
                }
                label="Penyewa"
              />
              <SelectBox
                control={form.control}
                name="house_id"
                options={
                  rooms?.filter(room => room.status === 'available' || (modeUpdate && room.id === data?.house_id)).map((room) => ({
                    id: room.id,
                    name: `${room.apartments.name} - ${room.name}`,
                  })) || []
                }
                label="Kamar"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                control={form.control}
                name="move_in"
                label="Tanggal Masuk"
                type="date"
              />
              <Input
                control={form.control}
                name="move_out"
                label="Tanggal Keluar"
                type="date"
              />
            </div>
            <Input
              control={form.control}
              name="monthly_price"
              label="Harga per Bulan (IDR)"
              placeholder="Contoh: 500000"
              inputMode="numeric"
              type="number"
              pattern="[0-9]*"
            />

            {modeUpdate && (
              <SelectBox
                control={form.control}
                name="status"
                label="Status Sewa"
                options={[
                  { id: "active", name: "Aktif" },
                  { id: "completed", name: "Selesai" },
                  { id: "terminated", name: "Dihentikan" },
                  { id: "cancelled", name: "Dibatalkan" },
                ]}
              />
            )}

            <Input
              control={form.control}
              name="note"
              label="Catatan"
              placeholder="Catatan tambahan (opsional)"
              inputMode="text"
              type="text"
              required={false}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoaderCircle size={16} className="animate-spin" />
                  {modeUpdate ? "Memperbarui..." : "Menyimpan..."}
                </>
              ) : (
                modeUpdate ? "Perbarui Data" : "Simpan Data"
              )}
            </Button>
          </form>
        </Form>
      </ResponsiveDialog>
      {!modeUpdate && (
        <Button type="button" onClick={handleButtonClick}>
          <PlusCircle size={16} />
          <span className="hidden sm:flex">Tambah data</span>
        </Button>
      )}
    </>
  );
};

export default RentalForm;
