"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Practicum } from "./practicums-columns"
import { useRouter } from 'next/navigation'

interface CreatePracticumFormProps {
    onSubmit: (data: Practicum) => void
}

export function CreatePracticumForm({ onSubmit }: CreatePracticumFormProps) {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<Practicum>()
    const router = useRouter()

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded-lg shadow-sm">
            <div className="flex flex-col">
                <label className="mb-1 text-sm">Kode</label>
                <Input className="[&::-webkit-inner-spin-button]:appearance-none" type="number" {...register("kode", { required: true })} placeholder="Masukan Kode Mata Kuliah" />
                {errors.kode && <span className="text-red-500 text-xs">Kode is required</span>}
            </div>

            <div className="flex flex-col">
                <label className="mb-1 text-sm">Nama Mata Kuliah</label>
                <Input type="text" {...register("nama", { required: true })} placeholder="Masukan nama mata kuliah" />
                {errors.nama && <span className="text-red-500 text-xs">Nama is required</span>}
            </div>

            <div className="flex flex-col">
                <label className="mb-1 text-sm">Deskripsi</label>
                <Input type="text" {...register("deskripsi", { required: true })} placeholder="Masukan Deskripsi" />
                {errors.deskripsi && <span className="text-red-500 text-xs">Deskripsi is required</span>}
            </div>

            <div className="flex flex-col">
                <label className="mb-1 text-sm">SKS</label>
                <Input type="number" {...register("sks", { required: true, valueAsNumber: true })} placeholder="Masukan SKS" />
                {errors.sks && <span className="text-red-500 text-xs">SKS is required</span>}
            </div>

            <div className="flex flex-col">
                <label className="mb-1 text-sm">Semester</label>
                <Select onValueChange={(value) => setValue("semester", value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih Semester" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Semester Gasal 2024/2025">Semester Gasal 2024/2025</SelectItem>
                        <SelectItem value="Semester Genap 2024/2025">Semester Genap 2024/2025</SelectItem>
                        <SelectItem value="Semester Gasal 2025/2026">Semester Gasal 2025/2026</SelectItem>
                        <SelectItem value="Semester Genap 2025/2026">Semester Genap 2025/2026</SelectItem>
                    </SelectContent>
                </Select>
                {errors.semester && <span className="text-red-500 text-xs">Semester is required</span>}
            </div>

            <div className="flex flex-row gap-2 justify-end">
                <Button type="submit">Create Practicum</Button>
                <Button type="button" variant="secondary" onClick={router.back}>Cancel</Button>
            </div>
        </form>
    )
}
