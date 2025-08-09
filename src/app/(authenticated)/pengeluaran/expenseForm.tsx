"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/form-controller/input";
import SelectBox from "@/components/form-controller/selectionBox";
import { LoaderCircle, PlusCircle, Receipt } from "lucide-react";
import { useState } from "react";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { z } from "zod";
import { api } from "@/trpc/react";
import { expenseSchema, expenseCategoryLabels } from "@/utils/schemas/expense";
import { Expense } from "@/utils/types";
import { toast } from "sonner";

type Props = {
    data?: Expense;
    title: string;
    description: string;
    modeUpdate: boolean;
    isUpdateOpen?: boolean;
    setUpdateOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

const ExpenseForm = ({
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

    // Get apartments for selection
    const { data: apartments } = api.apartment.list.useQuery();

    const form = useForm<z.infer<typeof expenseSchema>>({
        resolver: zodResolver(expenseSchema),
        defaultValues: !modeUpdate ? {
            apartment_id: undefined,
            category: "other",
            description: "",
            amount: "",
            expense_date: new Date().toISOString().split('T')[0],
            meter_reading_before: "",
            meter_reading_after: "",
            receipt_url: "",
            note: "",
        } : {
            id: data?.id || "",
            apartment_id: data?.apartment_id || undefined,
            category: data?.category || "other",
            description: data?.description || "",
            amount: data?.amount || "",
            expense_date: data?.expense_date || "",
            meter_reading_before: data?.meter_reading_before || "",
            meter_reading_after: data?.meter_reading_after || "",
            receipt_url: data?.receipt_url || "",
            note: data?.note || "",
        },
    });

    const selectedCategory = form.watch("category");

    const updateExpense = api.expense.update.useMutation({
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

    const createExpense = api.expense.create.useMutation({
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

    const onSubmit: SubmitHandler<z.infer<typeof expenseSchema>> = async (formData) => {
        setLoading(true);

        try {
            if (modeUpdate) {
                await updateExpense.mutateAsync({
                    id: formData.id ?? "",
                    apartment_id: formData.apartment_id,
                    category: formData.category,
                    description: formData.description,
                    amount: formData.amount,
                    expense_date: formData.expense_date,
                    meter_reading_before: formData.meter_reading_before,
                    meter_reading_after: formData.meter_reading_after,
                    receipt_url: formData.receipt_url,
                    note: formData.note,
                });
            } else {
                await createExpense.mutateAsync({
                    apartment_id: formData.apartment_id,
                    category: formData.category,
                    description: formData.description,
                    amount: formData.amount,
                    expense_date: formData.expense_date,
                    meter_reading_before: formData.meter_reading_before,
                    meter_reading_after: formData.meter_reading_after,
                    receipt_url: formData.receipt_url,
                    note: formData.note,
                });
            }
        } catch (error) {
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

    const categoryOptions = Object.entries(expenseCategoryLabels).map(([value, label]) => ({
        id: value,
        name: label,
    }));

    const apartmentOptions = apartments?.map(apartment => ({
        id: apartment.id,
        name: apartment.name,
    })).filter(option => option.id && option.id.trim() !== "") || [];

    const showMeterReadings = selectedCategory === "electricity" || selectedCategory === "water";

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
                        <SelectBox
                            control={form.control}
                            name="apartment_id"
                            label="Bangunan"
                            options={apartmentOptions}
                        />

                        <SelectBox
                            control={form.control}
                            name="category"
                            label="Kategori"
                            options={categoryOptions}
                        />

                        <Input
                            control={form.control}
                            name="description"
                            label="Deskripsi"
                            placeholder="Contoh: Bayar listrik bulan Desember 2024"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                control={form.control}
                                name="amount"
                                label="Jumlah"
                                placeholder="Contoh: 150000"
                                inputMode="numeric"
                                type="number"
                            />
                            <Input
                                control={form.control}
                                name="expense_date"
                                label="Tanggal Pengeluaran"
                                type="date"
                            />
                        </div>

                        {showMeterReadings && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    control={form.control}
                                    name="meter_reading_before"
                                    label={`Meteran Sebelum (${selectedCategory === "electricity" ? "kWh" : "m³"})`}
                                    placeholder="Contoh: 1500"
                                    inputMode="numeric"
                                    type="number"
                                    required={false}
                                />
                                <Input
                                    control={form.control}
                                    name="meter_reading_after"
                                    label={`Meteran Sesudah (${selectedCategory === "electricity" ? "kWh" : "m³"})`}
                                    placeholder="Contoh: 1650"
                                    inputMode="numeric"
                                    type="number"
                                    required={false}
                                />
                            </div>
                        )}

                        <Input
                            control={form.control}
                            name="receipt_url"
                            label="Link Bukti/Foto Struk (opsional)"
                            placeholder="https://drive.google.com/..."
                            type="url"
                            required={false}
                        />

                        <Input
                            control={form.control}
                            name="note"
                            label="Catatan"
                            placeholder="Catatan tambahan (opsional)"
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
                    <Receipt size={16} />
                    <span className="hidden sm:flex">Tambah Pengeluaran</span>
                </Button>
            )}
        </>
    );
};

export default ExpenseForm;
