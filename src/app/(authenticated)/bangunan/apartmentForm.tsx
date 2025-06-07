"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Input } from "@/components/form-controller/input";
import { LoaderCircle, PlusCircle } from "lucide-react";
import { useState } from "react";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { z } from "zod";
import { api } from "@/trpc/react";
import { apartmentSchema } from "@/utils/schemas/apartment";
import { Apartment } from "@/utils/types";

type Props = {
  data?: Apartment;
  title: string;
  description: string;
  modeUpdate: boolean;
  isUpdateOpen?: boolean;
  setUpdateOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

const ApartmentForm = ({
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


  const form = useForm<z.infer<typeof apartmentSchema>>({
    resolver: zodResolver(apartmentSchema),
    defaultValues:
      !modeUpdate ? {
        name: "",
        description: "",
        address: "",
        gmaps: "",
        electric_number: "",
        water_number: "",
      } : {
        id: data?.id || "",
        name: data?.name || "",
        description: data?.description || "",
        address: data?.address || "",
        gmaps: data?.gmaps || "",
        electric_number: data?.electric_number || "",
        water_number: data?.water_number || "",
      },
  });

  // Add mutation hooks
  const updateApartment = api.apartment.update.useMutation();
  const createApartment = api.apartment.create.useMutation();

  const onSubmit: SubmitHandler<z.infer<typeof apartmentSchema>> = async (data) => {
    setLoading(true);
    try {
      if (modeUpdate) {
        await updateApartment.mutateAsync({
          id: data.id ?? "",
          name: data.name,
          description: data.description,
          address: data.address,
          gmaps: data.gmaps,
          electric_number: data.electric_number,
          water_number: data.water_number,
        });
        toast({
          title: "Data berhasil diperbarui",
        });
      } else {
        await createApartment.mutateAsync({
          name: data.name,
          description: data.description,
          address: data.address,
          gmaps: data.gmaps,
          electric_number: data.electric_number,
          water_number: data.water_number,
        });
        toast({
          title: "Data berhasil ditambahkan",
        });
      }
    } catch (error) {
      toast({
        title: "Terjadi kesalahan saat menyimpan data",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
    form.reset();
    router.refresh();
    setLoading(false);
    setUpdateOpen ? setUpdateOpen(false) : setIsOpen(false);
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
              label="Nama"
              placeholder="Contoh: Kost Joni"
            />
            <Input
              control={form.control}
              name="description"
              label="Deskripsi"
              placeholder="Contoh: Rumah nya ber AC"
              inputMode="text"
              type="text"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <Input
                control={form.control}
                name="electric_number"
                label="No Listrik"
                placeholder="Masukan nomor listrik"
                inputMode="numeric"
                type="number"
                pattern="[0-9]*"
              />
              <Input
                control={form.control}
                name="water_number"
                label="No Air"
                placeholder="Masukan nomor air"
                inputMode="numeric"
                type="number"
                pattern="[0-9]*"
              />
            </div>
            <Input
              control={form.control}
              name="address"
              label="Alamat"
              type="text"
              placeholder="Contoh: Jl. Raya No. 123, Jakarta"
            />
            <Input
              control={form.control}
              name="gmaps"
              label="Link Google Maps"
              type="url"
              placeholder="Masukan link Google Maps"
            />
            <Button
              type="submit"
              className="w-full"
              {...(loading && { disabled: true })}
            >
              {loading && <LoaderCircle size={24} className="animate-spin" />}
              Simpan
            </Button>
          </form>
        </Form>
      </ResponsiveDialog>
      {!modeUpdate && (
        <Button type="button" onClick={() => setIsOpen(!isOpen)}>
          <PlusCircle className="" size={16} />
          <span className="hidden sm:flex">Tambah data</span>
        </Button>
      )}
    </>
  );
};

export default ApartmentForm;