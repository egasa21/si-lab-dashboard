"use client";

import { useRouter } from "next/navigation";
import { Practicum } from "../components/practicums-columns";
import { CreatePracticumForm } from "../components/create-practicum-form";
import { createPracticum } from "@/lib/api/practicums";
import { useState } from "react";

export default function CreatePracticumPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (newPracticum: Practicum) => {
        setLoading(true);
        setError("");

        try {
            const practicumData = {
                code: newPracticum.kode,
                name: newPracticum.nama,
                description: newPracticum.deskripsi,
                credits: newPracticum.sks,
                semester: newPracticum.semester,
            };

            await createPracticum(practicumData);
            router.push("/dashboard/practicums");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-0">
            {error && <p className="text-red-500">{error}</p>}
            <CreatePracticumForm onSubmit={handleSubmit} loading={loading} />
        </div>
    );
}
