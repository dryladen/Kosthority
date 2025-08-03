"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/form-controller/input";
import { LoaderCircle, PlusCircle } from "lucide-react";
import { useState } from "react";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { z } from "zod";
import { api } from "@/trpc/react";
import { tenantSchema } from "@/utils/schemas/tenant";
import { Tenant } from "@/utils/types";
import { toast } from "sonner";

type Props = {
  data?: Tenant;
  title: string;
  description: string;
  modeUpdate: boolean;
  isUpdateOpen?: boolean;
  setUpdateOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

const TenantForm = ({
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

  const form = useForm<z.infer<typeof tenantSchema>>({
    resolver: zodResolver(tenantSchema),
    defaultValues: !modeUpdate ? {
      name: "",
      phone: "",
      ktp_address: "",
      note: "",
    } : {
      id: data?.id || "",
      name: data?.name || "",
      phone: data?.phone || "",
      ktp_address: data?.ktp_address || "",
      note: data?.note || "",
    },
  });

  // Simple mutations without utils
  const updateTenant = api.tenant.update.useMutation({
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

  const createTenant = api.tenant.create.useMutation({
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

  const onSubmit: SubmitHandler<z.infer<typeof tenantSchema>> = async (formData) => {
    setLoading(true);
    
    try {
      if (modeUpdate) {
        await updateTenant.mutateAsync({
          id: formData.id ?? "",
          name: formData.name,
          phone: formData.phone,
          ktp_address: formData.ktp_address,
          note: formData.note,
        });
      } else {
        await createTenant.mutateAsync({
          name: formData.name,
          phone: formData.phone,
          ktp_address: formData.ktp_address,
          note: formData.note,
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
              label="Nama"
              placeholder="Contoh: Budi Santoso"
            />
            <Input
              control={form.control}
              name="phone"
              label="No. Telepon"
              placeholder="Contoh: 08123456789"
              inputMode="tel"
              type="tel"
            />
            <Input
              control={form.control}
              name="ktp_address"
              label="Alamat KTP"
              placeholder="Contoh: Jl. Raya No. 123, Jakarta"
              inputMode="text"
              type="text"
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

export default TenantForm;
