"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/form-controller/input";
import { LoaderCircle, PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";
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
  preSelectedRentalId?: string;
};

const PaymentForm = ({
  data,
  title,
  description,
  modeUpdate,
  isUpdateOpen,
  setUpdateOpen,
  preSelectedRentalId,
}: Props) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch rentals for selection
  const { data: rentals, isLoading: rentalsLoading } = api.rental.list.useQuery();

  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: !modeUpdate ? {
      rental_id: preSelectedRentalId ? parseInt(preSelectedRentalId) : undefined,
      amount: "",
      note: "",
      for_month: new Date().toISOString().slice(0, 7), // Current month (YYYY-MM)
    } : {
      id: data?.id || undefined,
      rental_id: data?.rental_id || undefined,
      amount: data?.amount || "", 
      note: data?.note || "",
      for_month: data?.for_month ? data.for_month.slice(0, 7) : "", // Convert from date to month
    },
  });

  // Auto-open dialog if rental is pre-selected
  useEffect(() => {
    if (preSelectedRentalId && !modeUpdate) {
      setIsOpen(true);
    }
  }, [preSelectedRentalId, modeUpdate]);

  // Auto-fill amount when preSelectedRentalId is available
  useEffect(() => {
    if (preSelectedRentalId && rentals && !modeUpdate) {
      const rental = rentals.find(r => r.id === parseInt(preSelectedRentalId));
      if (rental) {
        form.setValue("amount", rental.monthly_price);
      }
    }
  }, [preSelectedRentalId, rentals, modeUpdate, form]);

  // Watch rental_id to auto-fill amount based on monthly price
  const selectedRentalId = form.watch("rental_id");
  const selectedRental = rentals?.find(rental => rental.id === selectedRentalId);
  
  // Watch for_month to check existing payments
  const selectedMonth = form.watch("for_month");
  
  // Fetch existing payments for selected rental and month
  const { data: existingPayments } = api.payment.getByRentalId.useQuery(
    selectedRentalId?.toString() || "",
    { enabled: !!selectedRentalId }
  );
  
  // Check if there are existing payments for the selected month
  const existingPaymentsForMonth = existingPayments?.filter(payment => 
    payment.for_month.startsWith(selectedMonth || "")
  ) || [];
  
  const totalExistingAmount = existingPaymentsForMonth.reduce((sum, payment) => 
    sum + parseFloat(payment.amount), 0
  );
  
  const monthlyPrice = selectedRental ? parseFloat(selectedRental.monthly_price) : 0;

  // Auto-fill amount when rental is selected (only for new payments)
  const handleRentalChange = (rentalId: number) => {
    const rental = rentals?.find(r => r.id === rentalId);
    if (rental && !modeUpdate) {
      form.setValue("amount", rental.monthly_price);
    }
  };

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
          id: formData.id ?? undefined,
          rental_id: formData.rental_id,
          amount: formData.amount,
          note: formData.note,
          for_month: formData.for_month, // Send as YYYY-MM, server will convert to YYYY-MM-DD
        });
      } else {
        await createPayment.mutateAsync({
          rental_id: formData.rental_id,
          amount: formData.amount,
          note: formData.note,
          for_month: formData.for_month, // Send as YYYY-MM, server will convert to YYYY-MM-DD
        });
      }
    } catch (error) {
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
                        const rentalId = Number(e.target.value);
                        field.onChange(rentalId); // Convert to number for form
                        handleRentalChange(rentalId);
                      }}
                      value={field.value || ""} // Ensure controlled input
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

            {!selectedRentalId && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm">
                <p className="text-blue-700">
                  ℹ️ Silakan pilih kontrak sewa terlebih dahulu untuk melanjutkan
                </p>
              </div>
            )}

            {/* Warning untuk pembayaran yang sudah ada */}
            {!modeUpdate && existingPaymentsForMonth.length > 0 && selectedMonth && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-md text-sm">
                <p className="font-medium text-orange-800 mb-2">⚠️ Sudah Ada Pembayaran untuk Bulan Ini</p>
                <div className="space-y-1 text-orange-700">
                  {existingPaymentsForMonth.map((payment, index) => (
                    <p key={index}>
                      • {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(parseFloat(payment.amount))} 
                      {payment.note ? ` (${payment.note})` : ''}
                    </p>
                  ))}
                  <p className="font-medium mt-2">
                    Total saat ini: {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(totalExistingAmount)}
                  </p>
                  <p className="text-xs mt-1">
                    {totalExistingAmount >= monthlyPrice 
                      ? `✅ Sudah lunas (kelebihan: ${new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(totalExistingAmount - monthlyPrice)})`
                      : `Kurang: ${new Intl.NumberFormat("id-ID", {
                          style: "currency", 
                          currency: "IDR",
                        }).format(monthlyPrice - totalExistingAmount)}`
                    }
                  </p>
                  <p className="text-xs text-orange-600 mt-2">
                    💡 Pembayaran baru akan ditambahkan ke total pembayaran bulan ini.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                control={form.control}
                name="for_month"
                label="Untuk Bulan"
                type="month"
                placeholder="Pilih bulan"
                disabled={!selectedRentalId}
              />
              <Input
                control={form.control}
                name="amount"
                label="Jumlah Bayar (IDR)"
                placeholder="Contoh: 500000"
                inputMode="numeric"
                type="number"
                pattern="[0-9]*"
                disabled={!selectedRentalId}
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
              disabled={!selectedRentalId}
            />
            
            <Button
              type="submit"
              className="w-full"
              disabled={loading || !selectedRentalId}
            >
              {loading && <LoaderCircle size={24} className="animate-spin" />}
              {modeUpdate ? "Update" : "Catat Pembayaran"}
            </Button>
          </form>
        </Form>
      </ResponsiveDialog>
      {!modeUpdate && (
        <Button type="button" onClick={handleButtonClick}>
          <PlusCircle size={16} />
          <span className="hidden sm:flex">
            {preSelectedRentalId 
              ? `Catat Pembayaran untuk ${rentals?.find(r => r.id === parseInt(preSelectedRentalId))?.tenants?.name || 'Penyewa'}`
              : "Catat Pembayaran"
            }
          </span>
        </Button>
      )}
    </>
  );
};

export default PaymentForm;
