"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/form-controller/input";
import SelectBox from "@/components/form-controller/selectionBox";
import { LoaderCircle, PlusCircle, NotebookText } from "lucide-react";
import { useState } from "react";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { z } from "zod";
import { api } from "@/trpc/react";
import { noteSchema, noteCategoryLabels, notePriorityLabels } from "@/utils/schemas/note";
import { Note } from "@/utils/types";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

type Props = {
    data?: Note;
    title: string;
    description: string;
    modeUpdate: boolean;
    isUpdateOpen?: boolean;
    setUpdateOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

const NoteForm = ({
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

    const form = useForm<z.infer<typeof noteSchema>>({
        resolver: zodResolver(noteSchema),
        defaultValues: !modeUpdate ? {
            title: "",
            content: "",
            category: "general",
            priority: "medium",
            apartment_id: undefined,
        } : {
            id: data?.id || undefined,
            title: data?.title || "",
            content: data?.content || "",
            category: data?.category || "general",
            priority: data?.priority || "medium",
            apartment_id: data?.apartment_id || undefined,
        }
    });

    const utils = api.useUtils();

    const updateNote = api.note.update.useMutation({
        onSuccess: () => {
            toast.success("Catatan berhasil diperbarui!");
            utils.note.list.invalidate();
            form.reset();
            setLoading(false);
            router.refresh();
            handleOpenChange(false);
        },
        onError: (error) => {
            toast.error(`Gagal memperbarui catatan: ${error.message}`);
            setLoading(false);
        },
    });

    const createNote = api.note.create.useMutation({
        onSuccess: () => {
            toast.success("Catatan berhasil dibuat!");
            utils.note.list.invalidate();
            form.reset();
            setLoading(false);
            router.refresh();
            setIsOpen(false);
        },
        onError: (error) => {
            toast.error(`Gagal membuat catatan: ${error.message}`);
            setLoading(false);
        },
    });

    const onSubmit: SubmitHandler<z.infer<typeof noteSchema>> = async (formData) => {
        setLoading(true);
        try {
            if (modeUpdate && data?.id) {
                await updateNote.mutateAsync({
                    id: data.id,
                    title: formData.title,
                    content: formData.content,
                    category: formData.category,
                    priority: formData.priority,
                    apartment_id: formData.apartment_id,
                });
            } else {
                await createNote.mutateAsync({
                    title: formData.title,
                    content: formData.content,
                    category: formData.category,
                    priority: formData.priority,
                    apartment_id: formData.apartment_id,
                });
            }
        } catch (error) {
            // Error handling is done in the mutation callbacks
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

    const categoryOptions = Object.entries(noteCategoryLabels).map(([value, label]) => ({
        id: value,
        name: label,
    }));

    const priorityOptions = Object.entries(notePriorityLabels).map(([value, label]) => ({
        id: value,
        name: label,
    }));

    const apartmentOptions = apartments?.map(apartment => ({
        id: apartment.id,
        name: apartment.name,
    })).filter(option => option.id && option.id.trim() !== "") || [];

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
                            name="title"
                            label="Judul Catatan"
                            placeholder="Contoh: Perbaikan AC kamar 101"
                        />

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Konten Catatan</label>
                            <Textarea
                                placeholder="Tulis konten catatan di sini..."
                                className="min-h-[100px]"
                                {...form.register("content")}
                            />
                            {form.formState.errors.content && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.content.message}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <SelectBox
                                control={form.control}
                                name="category"
                                label="Kategori"
                                options={categoryOptions}
                            />

                            <SelectBox
                                control={form.control}
                                name="priority"
                                label="Prioritas"
                                options={priorityOptions}
                            />
                        </div>

                        <SelectBox
                            control={form.control}
                            name="apartment_id"
                            label="Bangunan (Opsional)"
                            options={apartmentOptions}
                        />

                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleOpenChange(false)}
                                className="flex-1"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex-1"
                            >
                                {loading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                {modeUpdate ? "Perbarui" : "Simpan"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </ResponsiveDialog>

            {!modeUpdate && (
                <Button onClick={handleButtonClick} className="gap-2">
                    <PlusCircle size={16} />
                    Tambah Catatan
                </Button>
            )}
        </>
    );
};

export default NoteForm;
