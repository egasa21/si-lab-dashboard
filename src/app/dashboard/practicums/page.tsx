"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CardPracticum } from "./components/card-practicum";
import defaultImage from "../../../../public/default-image.jpg";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon, Trash } from "lucide-react";
import { PracticumModulModal } from "./components/practicum-module";
import { CreatePracticumDialog } from "./components/create-practicum-dialog";

// Types
type ModuleType = {
    id: number;
    title: string;
    materials: string[];
    creatingMaterial?: boolean;
    newMaterialTitle?: string;
};

export default function Practicums() {
    const router = useRouter();
    const [isPracModulesOpen, setPracModulesOpen] = useState(false);


    const [data, setData] = useState([
        {
            id: "1",
            image: defaultImage,
            name: "Pengujian dan Penjaminan Mutu Perangkat Lunak",
            semester: "Gasal 2024/2025",
            updatedAt: "4h ago",
        },
        {
            id: "2",
            image: defaultImage,
            name: "Rekayasa Perangkat Lunak",
            semester: "Genap 2024/2025",
            updatedAt: "2 days ago",
        },
        {
            id: "3",
            image: defaultImage,
            name: "Pemrograman Berbasis Web",
            semester: "Gasal 2025/2026",
            updatedAt: "1 week ago",
        },
        {
            id: "4",
            image: defaultImage,
            name: "Desain dan Pengalaman Pengguna",
            semester: "Gasal 2025/2026",
            updatedAt: "1 week ago",
        },
    ]);


    const handleAddUser = (id: string) => {
        console.log(`Add user to practicum with ID: ${id}`);
    };

    const handleEdit = (id: string) => {
        router.push(`/dashboard/practicums/${id}/edit`);
    };

    const [open, setOpen] = useState(false);
    const [selectedPracticumId, setSelectedPracticumId] = useState<string | null>(null);

    const handleDelete = (id: string) => {
        setSelectedPracticumId(id);
        setOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedPracticumId) return;
        setData((prevData) => prevData.filter((item) => item.id !== selectedPracticumId));
        setOpen(false);
        setSelectedPracticumId(null);
    };

    const cancelDelete = () => {
        setOpen(false);
        setSelectedPracticumId(null);
    };





    return (
        <div>
            <div className="flex justify-end mb-3">
                <Button variant="outline" onClick={() => router.push('/dashboard/practicums/create')}>
                    <PlusCircleIcon className="mr-2 h-4 w-4" />
                    Buat Praktikum Baru
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.map((practicum) => (
                    <CardPracticum
                        key={practicum.id}
                        image={practicum.image}
                        name={practicum.name}
                        semester={practicum.semester}
                        updatedAt={practicum.updatedAt}
                        onClick={() => setPracModulesOpen(true)}
                        onAddUser={() => handleAddUser(practicum.id)}
                        onEdit={() => handleEdit(practicum.id)}
                        onDelete={() => handleDelete(practicum.id)}
                    />
                ))}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus praktikum ini? Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="secondary" onClick={cancelDelete}>
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <PracticumModulModal isOpen={isPracModulesOpen} onClose={() => setPracModulesOpen(false)} />

        </div>
    );
}
