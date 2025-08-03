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
import { roomSchema } from "@/utils/schemas/room";
import { Room } from "@/utils/types";
import { toast } from "sonner";

type Props = {
  data?: Room;
  title: string;
  description: string;
  modeUpdate: boolean;
  isUpdateOpen?: boolean;
  setUpdateOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

const RoomForm = ({
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

  // Fetch apartments for selection
  const { data: apartments, isLoading: apartmentsLoading } = api.apartment.list.useQuery();

  const form = useForm<z.infer<typeof roomSchema>>({
    resolver: zodResolver(roomSchema),
    defaultValues: !modeUpdate ? {
      name: "",
      status: "available",
      price: "",
      apartment_id: "",
    } : {
      id: data?.id || "",
      name: data?.name || "",
      status: data?.status || "available",
      price: data?.price || "",
      apartment_id: data?.apartment_id || "",
    },
  });

  // Simple mutations without utils
  const updateRoom = api.room.update.useMutation({
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

  const createRoom = api.room.create.useMutation({
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

  const onSubmit: SubmitHandler<z.infer<typeof roomSchema>> = async (formData) => {
    setLoading(true);
    
    try {
      if (modeUpdate) {
        await updateRoom.mutateAsync({
          id: formData.id ?? "",
          name: formData.name,
          status: formData.status,
          price: formData.price,
          apartment_id: formData.apartment_id,
        });
      } else {
        await createRoom.mutateAsync({
          name: formData.name,
          status: formData.status,
          price: formData.price,
          apartment_id: formData.apartment_id,
        });
      }
    } catch (error) {
      // Error handling sudah ada di mutation callbacks
      console.error("Form submission error:", error);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (modeUpdate) {
      setUpdateOpen?.(open);
    } else {
      setIsOpen(open);
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
            <Input
              control={form.control}
              name="name"
              label="Nama Kamar"
              placeholder="Contoh: Kamar 01"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="available">Tersedia</option>
                        <option value="occupied">Terisi</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Input
                control={form.control}
                name="price"
                label="Harga (IDR)"
                placeholder="Contoh: 500000"
                inputMode="numeric"
                type="number"
                pattern="[0-9]*"
              />
            </div>
            <FormField
              control={form.control}
              name="apartment_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bangunan</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      disabled={apartmentsLoading}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">{apartmentsLoading ? "Loading..." : "Pilih bangunan"}</option>
                      {apartments?.map((apartment) => (
                        <option key={apartment.id} value={apartment.id}>
                          {apartment.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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

export default RoomForm;
