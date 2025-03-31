"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getPracticumById, updatePracticum } from "@/lib/api/practicums";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function EditPracticum() {
    const router = useRouter();
    const { id } = useParams() as { id: string };
    const [practicum, setPracticum] = useState({
        kode: "",
        nama: "",
        deskripsi: "",
        sks: "",
        semester: "",
    });

    useEffect(() => {
        async function fetchPracticum() {
            try {
                const response = await getPracticumById(id);

                const data = response.data;
                setPracticum({
                    kode: data.code,
                    nama: data.name,
                    deskripsi: data.description,
                    sks: data.credits,
                    semester: data.semester,
                });

                console.log(data);

            } catch (error) {
                console.error("Failed to fetch practicum", error);
            }
        }
        fetchPracticum();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPracticum({ ...practicum, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updatePracticum(id, practicum);
            router.push("/dashboard/practicums");
        } catch (error) {
            console.error("Failed to update practicum", error);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Edit Practicum</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input name="kode" value={practicum.kode} onChange={handleChange} placeholder="Kode" />
                <Input name="nama" value={practicum.nama} onChange={handleChange} placeholder="Nama" />
                <Input name="deskripsi" value={practicum.deskripsi} onChange={handleChange} placeholder="Deskripsi" />
                <Input name="sks" type="number" value={practicum.sks} onChange={handleChange} placeholder="SKS" />
                <Select value={practicum.semester} onValueChange={(value) => setPracticum({ ...practicum, semester: value })}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Semester" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Gasal 2024/2025">Gasal 2024/2025</SelectItem>
                        <SelectItem value="Genap 2024/2025">Genap 2024/2025</SelectItem>
                        <SelectItem value="Gasal 2025/2026">Gasal 2025/2026</SelectItem>
                        <SelectItem value="Genap 2025/2026">Genap 2025/2026</SelectItem>
                    </SelectContent>
                </Select>

                <div className="flex gap-2">
                    <Button type="submit">Update Practicum</Button>
                    <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
                </div>
            </form>
        </div>
    );
}
