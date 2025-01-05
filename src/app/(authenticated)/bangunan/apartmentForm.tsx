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

type Props = {
  data?: {
    id: string;
    name: string;
    base_unit: number;
  };
  title: string;
  description: string;
  modeUpdate: boolean;
  isUpdateOpen?: boolean;
  setUpdateOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

const formSchema = z.object({
  id_user : z.string(),
  name : z.string().nonempty(),
  description : z.string(),
  address : z.string(),
  gmaps : z.string(),
  electric_number : z.string(),
  water_number : z.string(),
  created_at : z.string(),
});

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


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:
      data ?? {
        id_user: "",
        name: "",
        description: "",
        address: "",
        gmaps: "",
        electric_number: "",
        water_number: "",
        created_at: "",
      }
      
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    setLoading(true);
    let response;
    // if (modeUpdate) {
    //   response = await updateUnits(data.id, data.name, data.base_unit);
    // } else {
    //   response = await createUnits(data.name, data.base_unit);
    // }
    // toast({
    //   title: response.message,
    //   variant: response.success === true ? "default" : "destructive",
    // });
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
              placeholder="Contoh: Bawang"
            />
            <Input
              control={form.control}
              name="description"
              label="Satuan dasar unit"
              placeholder="Contoh: misal 1 kg = 1000 gram"
              inputMode="numeric"
              type="number"
              pattern="[0-9]*"
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