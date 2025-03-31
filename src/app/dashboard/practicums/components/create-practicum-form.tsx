"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Practicum } from "./practicums-columns";
import { useRouter } from "next/navigation";

interface CreatePracticumFormProps {
    onSubmit: (data: Practicum) => void;
    loading?: boolean;
}

export function CreatePracticumForm({ onSubmit, loading }: CreatePracticumFormProps) {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<Practicum>();
    const router = useRouter();

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded-lg shadow-sm">
            <div className="flex flex-col">
                <label className="mb-1 text-sm">Kode</label>
                <Input
                    className="[&::-webkit-inner-spin-button]:appearance-none"
                    type="number"
                    {...register("kode", { required: true })}
                    placeholder="Masukan Kode Mata Kuliah"
                    disabled={loading}
                />
                {errors.kode && <span className="text-red-500 text-xs">Kode is required</span>}
            </div>

            <div className="flex flex-col">
                <label className="mb-1 text-sm">Nama Mata Kuliah</label>
                <Input
                    type="text"
                    {...register("nama", { required: true })}
                    placeholder="Masukan nama mata kuliah"
                    disabled={loading}
                />
                {errors.nama && <span className="text-red-500 text-xs">Nama is required</span>}
            </div>

            <div className="flex flex-col">
                <label className="mb-1 text-sm">Deskripsi</label>
                <Input
                    type="text"
                    {...register("deskripsi", { required: true })}
                    placeholder="Masukan Deskripsi"
                    disabled={loading}
                />
                {errors.deskripsi && <span className="text-red-500 text-xs">Deskripsi is required</span>}
            </div>

            <div className="flex flex-col">
                <label className="mb-1 text-sm">SKS</label>
                <Input
                className="[&::-webkit-inner-spin-button]:appearance-none"
                    type="number"
                    {...register("sks", { required: true, valueAsNumber: false })}
                    placeholder="Masukan SKS"
                    disabled={loading}
                />
                {errors.sks && <span className="text-red-500 text-xs">SKS is required</span>}
            </div>

            <div className="flex flex-col">
                <label className="mb-1 text-sm">Semester</label>
                <Select onValueChange={(value) => setValue("semester", value)} disabled={loading}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih Semester" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Gasal 2024/2025">Gasal 2024/2025</SelectItem>
                        <SelectItem value="Genap 2024/2025">Genap 2024/2025</SelectItem>
                        <SelectItem value="Gasal 2025/2026">Gasal 2025/2026</SelectItem>
                        <SelectItem value="Genap 2025/2026">Genap 2025/2026</SelectItem>
                    </SelectContent>
                </Select>
                {errors.semester && <span className="text-red-500 text-xs">Semester is required</span>}
            </div>

            <div className="flex flex-row gap-2 justify-end">
                <Button type="submit" disabled={loading}>
                    {loading ? (
                        <svg className="mr-3 size-5 animate-spin" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                    ) : (
                        "Create Practicum"
                    )}
                </Button>
                <Button type="button" variant="secondary" onClick={router.back} disabled={loading}>Cancel</Button>
            </div>
        </form>
    );
}
