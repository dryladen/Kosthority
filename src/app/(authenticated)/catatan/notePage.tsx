"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import {
    NotebookText,
    Search,
    Filter,
    Edit,
    Trash2,
    Calendar,
    Building,
    AlertCircle,
    CheckCircle,
    Clock
} from "lucide-react";
import { noteCategoryLabels, notePriorityLabels, notePriorityColors } from "@/utils/schemas/note";
import { Note } from "@/utils/types";
import NoteForm from "./noteForm";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import DeleteDialog from "@/components/form-controller/deleteDialog";

export default function NotePage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedPriority, setSelectedPriority] = useState<string>("all");
    const [isUpdateOpen, setUpdateOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState<Note | undefined>(undefined);
    const [isDeleteOpen, setDeleteOpen] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState<Note | undefined>(undefined);

    const router = useRouter();

    // Get notes data
    const { data: notes, isLoading } = api.note.list.useQuery();
    const utils = api.useUtils();

    const deleteNote = api.note.delete.useMutation({
        onSuccess: () => {
            toast.success("Catatan berhasil dihapus!");
            utils.note.list.invalidate();
            setDeleteOpen(false);
            setNoteToDelete(undefined);
            router.refresh();
        },
        onError: (error) => {
            toast.error(`Gagal menghapus catatan: ${error.message}`);
        },
    });

    const handleEdit = (note: Note) => {
        setSelectedNote(note);
        setUpdateOpen(true);
    };

    const handleDelete = (note: Note) => {
        setNoteToDelete(note);
        setDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (noteToDelete?.id) {
            await deleteNote.mutateAsync({ id: noteToDelete.id });
        }
    };

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat("id-ID", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(dateString));
    };

    // Filter notes based on search term and filters
    const filteredNotes = notes?.filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "all" || note.category === selectedCategory;
        const matchesPriority = selectedPriority === "all" || note.priority === selectedPriority;

        return matchesSearch && matchesCategory && matchesPriority;
    }) || [];

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case "high":
                return <AlertCircle className="h-4 w-4" />;
            case "medium":
                return <Clock className="h-4 w-4" />;
            case "low":
                return <CheckCircle className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Catatan</h1>
                    <p className="text-muted-foreground">Kelola catatan dan pengingat untuk operasional kost</p>
                </div>

                {/* Header skeleton */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <Skeleton className="h-10 w-32" />
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-48" />
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>

                {/* Notes skeleton */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <Skeleton className="h-5 w-32" />
                                    <div className="flex gap-2">
                                        <Skeleton className="h-5 w-16" />
                                        <Skeleton className="h-5 w-16" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Skeleton className="h-16 w-full" />
                                <div className="flex justify-between items-center">
                                    <Skeleton className="h-4 w-24" />
                                    <div className="flex gap-1">
                                        <Skeleton className="h-8 w-8" />
                                        <Skeleton className="h-8 w-8" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Catatan</h1>
                <p className="text-muted-foreground">
                    Kelola catatan dan pengingat untuk operasional kost
                </p>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <NoteForm
                    title="Tambah Catatan Baru"
                    description="Buat catatan baru untuk mencatat informasi penting"
                    modeUpdate={false}
                />

                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari catatan..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-full sm:w-48"
                        />
                    </div>

                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-full sm:w-32">
                            <SelectValue placeholder="Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua</SelectItem>
                            {Object.entries(noteCategoryLabels).map(([value, label]) => (
                                <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                        <SelectTrigger className="w-full sm:w-32">
                            <SelectValue placeholder="Prioritas" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua</SelectItem>
                            {Object.entries(notePriorityLabels).map(([value, label]) => (
                                <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Catatan</CardTitle>
                        <NotebookText className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{notes?.length || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Prioritas Tinggi</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {notes?.filter(note => note.priority === "high").length || 0}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Perawatan</CardTitle>
                        <Clock className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {notes?.filter(note => note.category === "maintenance").length || 0}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Penting</CardTitle>
                        <AlertCircle className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {notes?.filter(note => note.category === "important").length || 0}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Notes Grid */}
            {filteredNotes.length === 0 ? (
                <Card className="p-8 text-center">
                    <NotebookText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Tidak ada catatan</h3>
                    <p className="text-muted-foreground mb-4">
                        {searchTerm || selectedCategory !== "all" || selectedPriority !== "all"
                            ? "Tidak ada catatan yang sesuai dengan filter"
                            : "Belum ada catatan yang dibuat"}
                    </p>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredNotes.map((note) => (
                        <Card key={note.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start gap-2">
                                    <CardTitle className="text-base line-clamp-2">{note.title}</CardTitle>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <Badge variant="outline" className={notePriorityColors[note.priority as keyof typeof notePriorityColors]}>
                                            {getPriorityIcon(note.priority)}
                                            <span className="ml-1">{notePriorityLabels[note.priority as keyof typeof notePriorityLabels]}</span>
                                        </Badge>
                                        <Badge variant="secondary">
                                            {noteCategoryLabels[note.category as keyof typeof noteCategoryLabels]}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                    {note.content}
                                </p>

                                <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {formatDate(note.created_at)}
                                    </div>
                                    {note.apartment_id && (
                                        <div className="flex items-center gap-1">
                                            <Building className="h-3 w-3" />
                                            {notes?.find(n => n.id === note.id)?.apartments?.name || "Bangunan"}
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end gap-1 pt-2 border-t">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleEdit(note)}
                                        className="h-8 w-8 p-0"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleDelete(note)}
                                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Update Note Dialog */}
            <NoteForm
                data={selectedNote}
                title="Edit Catatan"
                description="Perbarui informasi catatan"
                modeUpdate={true}
                isUpdateOpen={isUpdateOpen}
                setUpdateOpen={setUpdateOpen}
            />

            {/* Delete Confirmation Dialog */}
            <DeleteDialog
                deleteOpen={isDeleteOpen}
                setDeleteOpen={setDeleteOpen}
                actionFn={confirmDelete}
            />
        </div>
    );
}
