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
import { paymentSchema } from "@/utils/schemas/payment";
import { Payment } from "@/utils/types";
import { toast } from "sonner";

type Props = {
  data?: Payment;
  title: string;
  description: string;
  modeUpdate: boolean;
  isUpdateOpen?: boolean;
  setUpdateOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

const PaymentForm = ({
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

  // Fetch rentals for selection
  const { data: rentals, isLoading: rentalsLoading } = api.rental.list.useQuery();

  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: !modeUpdate ? {
      rental_id: "",
      amount: "",
      note: "",
      for_month: new Date().toISOString().split('T')[0], // Current month
    } : {
      id: data?.id || "",
      rental_id: data?.rental_id || "",
      amount: data?.amount || "",
      note: data?.note || "",
      for_month: data?.for_month || "",
    },
  });

  // Watch rental_id to auto-fill amount based on monthly price
  const selectedRentalId = form.watch("rental_id");
  const selectedRental = rentals?.find(rental => rental.id === selectedRentalId);

  // Auto-fill amount when rental is selected (only for new payments)
  const handleRentalChange = (rentalId: string) => {
    const rental = rentals?.find(r => r.id === rentalId);
    if (rental && !modeUpdate) {
      form.setValue("amount", rental.monthly_price);
    }
  };

  // Simple mutations without utils
  const updatePayment = api.payment.update.useMutation({
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

  const createPayment = api.payment.create.useMutation({
    onSuccess: () => {
      toast.success("Pembayaran berhasil dicatat");
      form.reset();
      setUpdateOpen ? setUpdateOpen(false) : setIsOpen(false);
      router.refresh();
      setLoading(false);
    },
    onError: (error) => {
      toast.error(`Gagal mencatat pembayaran: ${error.message}`);
      setLoading(false);
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof paymentSchema>> = async (formData) => {
    setLoading(true);
    
    try {
      if (modeUpdate) {
        await updatePayment.mutateAsync({
          id: formData.id ?? "",
          rental_id: formData.rental_id,
          amount: formData.amount,
          note: formData.note,
          for_month: formData.for_month,
        });
      } else {
        await createPayment.mutateAsync({
          rental_id: formData.rental_id,
          amount: formData.amount,
          note: formData.note,
          for_month: formData.for_month,
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
            <FormField
              control={form.control}
              name="rental_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kontrak Sewa</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      disabled={rentalsLoading || modeUpdate}
                      onChange={(e) => {
                        field.onChange(e);
                        handleRentalChange(e.target.value);
                      }}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">{rentalsLoading ? "Loading..." : "Pilih kontrak sewa"}</option>
                      {rentals?.map((rental) => (
                        <option key={rental.id} value={rental.id}>
                          {rental.tenants?.name} - {rental.houses?.apartments?.name} {rental.houses?.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {selectedRental && (
              <div className="p-3 bg-muted rounded-md text-sm">
                <p><strong>Penyewa:</strong> {selectedRental.tenants?.name}</p>
                <p><strong>Kamar:</strong> {selectedRental.houses?.apartments?.name} - {selectedRental.houses?.name}</p>
                <p><strong>Harga/Bulan:</strong> {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(parseFloat(selectedRental.monthly_price))}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                control={form.control}
                name="for_month"
                label="Untuk Bulan"
                type="date"
                placeholder="Pilih bulan"
              />
              <Input
                control={form.control}
                name="amount"
                label="Jumlah Bayar (IDR)"
                placeholder="Contoh: 500000"
                inputMode="numeric"
                type="number"
                pattern="[0-9]*"
              />
            </div>
            
            <Input
              control={form.control}
              name="note"
              label="Catatan"
              placeholder="Catatan pembayaran (opsional)"
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
              {modeUpdate ? "Update" : "Catat Pembayaran"}
            </Button>
          </form>
        </Form>
      </ResponsiveDialog>
      {!modeUpdate && (
        <Button type="button" onClick={handleButtonClick}>
          <PlusCircle className="mr-2" size={16} />
          <span className="hidden sm:flex">Catat Pembayaran</span>
        </Button>
      )}
    </>
  );
};

export default PaymentForm;
