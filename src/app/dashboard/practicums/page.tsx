"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/data-table";
import { columns, Practicum } from "./components/practicums-columns";
import { useRouter } from "next/navigation";
import { getPracticums } from "@/lib/api/practicums";

export default function Practicums() {
    const router = useRouter();
    const [data, setData] = useState<Practicum[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const practicums = await getPracticums();
            setData(practicums.map((item: any) => ({
                kode: item.code,
                nama: item.name,
                deskripsi: item.description,
                sks: item.credits,
                semester: item.semester,
            })));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSearch = (value: string, searchableColumns: (keyof Practicum)[]) => {
        if (value === "") {
            fetchData();
        } else {
            setData((prevData) =>
                prevData.filter((item) =>
                    searchableColumns.some((column) =>
                        item[column]?.toString().toLowerCase().includes(value.toLowerCase())
                    )
                )
            );
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="space-y-4">
            <DataTable
                columns={columns}
                data={data}
                buttonText="Add Practicum"
                onButtonClick={() => router.push("/dashboard/practicums/create")}
                searchFunction={handleSearch}
                searchableColumns={["kode", "nama", "deskripsi"]}
            />
        </div>
    );
}
