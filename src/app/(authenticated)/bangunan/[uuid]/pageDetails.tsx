"use client";
import Link from "next/link";
import { ChevronLeft, Copy, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Input } from "@/components/form-controller/input";
import { Form } from "@/components/ui/form";
import { Suspense, useState } from "react";
import DeleteDialog from "@/components/form-controller/deleteDialog";
import { Apartment } from "@/utils/types";
import ApartmentForm from "../apartmentForm";

type Props = {
    data: Apartment
};

const PageDetails = ({
    data
}: Props) => {
    const [isUpdate, setIsUpdate] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    return (
        <div className="flex flex-col gap-4 w-full">
            <DeleteDialog
                deleteOpen={deleteOpen}
                setDeleteOpen={setDeleteOpen}
                actionFn={async () => {
                    // let response = await deleteProduct(productId);
                    // toast({
                    //     title: response.message,
                    //     variant: response.success === true ? "default" : "destructive",
                    // });
                    // router.push("/products");
                }}
            />
            <ApartmentForm
                data={data}
                title="Edit Data"
                description="Ubah data bangunan"
                modeUpdate={true}
                isUpdateOpen={isUpdate}
                setUpdateOpen={setIsUpdate}
            />
            <div className="flex items-center md:hidden gap-2">
                <Link href="/bangunan">
                    <Button
                        variant="outline"
                        size="icon"
                        type="button"
                        className="h-7 w-7"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Kembali</span>
                    </Button>
                </Link>
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-2xl font-semibold tracking-tight sm:grow-0">
                    {data.name}
                </h1>
            </div>
            <div className="hidden items-center gap-2 md:flex md:justify-end md:flex-grow">
                <Button onClick={() => setIsUpdate(true)} type="submit" size="sm">
                    Edit Data
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    type="button"
                    onClick={() => setDeleteOpen(true)}
                >
                    Hapus
                </Button>
            </div>
            <div className="flex flex-col gap-4">
                <div className="grid gap-4 md:col-span-2 lg:col-span-1">
                    <Card className="h-fit">
                        <CardHeader>
                            <CardTitle>Detail Bangunan</CardTitle>
                            <CardDescription>

                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            <div className="flex flex-col gap-2">
                                <div>
                                    <span className="font-medium">Nama:</span> {data.name}
                                </div>
                                <div>
                                    <span className="font-medium">Alamat:</span> {data.address}
                                </div>
                                <div>
                                    <span className="font-medium">Deskripsi:</span> {data.description || "-"}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Nomor Listrik:</span> {data.electric_number || "-"}
                                    {data.electric_number && (
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            className="h-5 w-5"
                                            onClick={() => {
                                                navigator.clipboard.writeText(data.electric_number!);
                                                toast({ title: "Nomor Listrik disalin ke clipboard" });
                                            }}
                                        >
                                            <Copy className="h-4 w-4" />
                                            <span className="sr-only">Copy Nomor Listrik</span>
                                        </Button>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Nomor Air:</span> {data.water_number || "-"}
                                    {data.water_number && (
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            className="h-5 w-5"
                                            onClick={() => {
                                                navigator.clipboard.writeText(data.water_number!);
                                                toast({ title: "Nomor Air disalin ke clipboard" });
                                            }}
                                        >
                                            <Copy className="h-4 w-4" />
                                            <span className="sr-only">Copy Nomor Air</span>
                                        </Button>
                                    )}
                                </div>
                                <div>
                                    <span className="font-medium">Jumlah Kamar:</span> 12
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="grid grid-cols-1  gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Status</CardTitle>
                            </CardHeader>
                            <CardContent>

                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>List Kamar</CardTitle>
                            </CardHeader>
                            <CardContent>

                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-end gap-2 md:hidden">
                <Button onClick={() => setIsUpdate(true)} type="submit" size="sm">
                    Edit Data
                </Button>
                <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={isUpdate}
                    onClick={() => setDeleteOpen(true)}
                >
                    Hapus
                </Button>
            </div>
        </div>
    );
};

export default PageDetails;