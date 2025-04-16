"use client";

import { useEffect, useState } from "react";
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
import { PlusCircleIcon } from "lucide-react";
import { PracticumModulModal } from "./components/practicum-module";
import { getPracticums, deletePracticum } from "@/lib/api/practicums";
import { PracticumModuleModal } from "./components/practicum-module/index";

type PracticumType = {
    id: string;
    name: string;
    semester: string;
    updated_at: string;
};

export default function Practicums() {
    const router = useRouter();
    const [data, setData] = useState<PracticumType[]>([]);
    const [isPracModulesOpen, setPracModulesOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedPracticumId, setSelectedPracticumId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await getPracticums();
                setData(result);
            } catch (error) {
                console.error("Failed to fetch practicums", error);
            }
        }
        fetchData();
    }, []);

    const handleAddUser = (id: string) => {
        console.log(`Add user to practicum with ID: ${id}`);
    };

    const handleEdit = (id: string) => {
        router.push(`/dashboard/practicums/${id}/edit`);
    };

    const handleDelete = (id: string) => {
        setSelectedPracticumId(id);
        setOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedPracticumId) return;
        try {
            await deletePracticum(selectedPracticumId);
            setData((prevData) => prevData.filter((item) => item.id !== selectedPracticumId));
        } catch (err) {
            console.error("Failed to delete practicum:", err);
        } finally {
            setOpen(false);
            setSelectedPracticumId(null);
        }
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
                        image={defaultImage}
                        name={practicum.name}
                        semester={practicum.semester}
                        updatedAt={new Date(practicum.updated_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                        onClick={() => {
                            setSelectedPracticumId(practicum.id);
                            setPracModulesOpen(true)}
                        }
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

            {/* <PracticumModulModal isOpen={isPracModulesOpen} onClose={() => setPracModulesOpen(false)} practicumId={selectedPracticumId}/> */}
            <PracticumModuleModal isOpen={isPracModulesOpen} onClose={() => setPracModulesOpen(false)} practicumId={selectedPracticumId}/>
        </div>
    );
}
