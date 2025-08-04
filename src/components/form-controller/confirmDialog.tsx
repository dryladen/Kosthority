import React from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    actionFn: () => void;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "destructive" | "warning" | "success";
};

const ConfirmDialog = ({
    open,
    setOpen,
    actionFn,
    title = "Konfirmasi Aksi",
    description = "Apakah Anda yakin ingin melakukan aksi ini?",
    confirmText = "Ya",
    cancelText = "Batal",
    variant = "default"
}: Props) => {

    const getVariantStyles = () => {
        switch (variant) {
            case "destructive":
                return "bg-red-500 hover:bg-red-600";
            case "warning":
                return "bg-orange-500 hover:bg-orange-600";
            case "success":
                return "bg-green-500 hover:bg-green-600";
            default:
                return "bg-primary hover:bg-primary/90";
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex">
                    <AlertDialogCancel>{cancelText}</AlertDialogCancel>
                    <AlertDialogAction
                        className={getVariantStyles()}
                        onClick={() => {
                            actionFn();
                        }}
                    >
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ConfirmDialog;
