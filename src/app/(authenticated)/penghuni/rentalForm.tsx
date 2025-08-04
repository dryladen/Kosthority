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

  const form = useForm<z.infer<typeof rentalSchema>>({
    resolver: zodResolver(rentalSchema),
    defaultValues: !modeUpdate ? {
      house_id: "",
      tenant_id: "",
      move_in: "",
      move_out: "",
      monthly_price: "",
      note: "",
    } : {
      id: data?.id || "",
      house_id: data?.house_id || "",
      tenant_id: data?.tenant_id || "",
      move_in: data?.move_in || "",
      move_out: data?.move_out || "",
      monthly_price: data?.monthly_price || "",
      note: data?.note || "",
    },
  });

  // Simple mutations without utils
  const updateRental = api.rental.update.useMutation({
    onSuccess: () => {
      toast.success("Data berhasil diperbarui");
      form.reset();
      setUpdateOpen ? setUpdateOpen(false) : setIsOpen(false);
      router.refresh();
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
        await updateRental.mutateAsync({
          id: formData.id ?? "",
          house_id: formData.house_id,
          tenant_id: formData.tenant_id,
          move_in: formData.move_in,
          move_out: formData.move_out,
          monthly_price: formData.monthly_price,
          note: formData.note,
        });
      } else {
        await createRental.mutateAsync({
          house_id: formData.house_id,
          tenant_id: formData.tenant_id,
          move_in: formData.move_in,
          move_out: formData.move_out,
          monthly_price: formData.monthly_price,
          note: formData.note,
        });
      }
    } catch (error) {
      // Error handling sudah ada di mutation callbacks
      console.error("Form submission error:", error);
    }
  };

  const handleButtonClick = () => {
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
              <FormField
                control={form.control}
                name="tenant_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Penyewa</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        disabled={tenantsLoading}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">{tenantsLoading ? "Loading..." : "Pilih penyewa"}</option>
                        {tenants?.map((tenant) => (
                          <option key={tenant.id} value={tenant.id}>
                            {tenant.name} - {tenant.phone}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="house_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kamar</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        disabled={roomsLoading}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">{roomsLoading ? "Loading..." : "Pilih kamar"}</option>
                        {rooms?.filter(room => room.status === 'available').map((room) => (
                          <option key={room.id} value={room.id}>
                            {room.apartments?.name} - {room.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
              {loading && <LoaderCircle size={24} className="animate-spin" />}
              Simpan
            </Button>
          </form>
        </Form>
      </ResponsiveDialog>
      {!modeUpdate && (
        <Button type="button" onClick={handleButtonClick}>
          <PlusCircle className="mr-2" size={16} />
          <span className="hidden sm:flex">Tambah data</span>
        </Button>
      )}
    </>
  );
};

export default RentalForm;
