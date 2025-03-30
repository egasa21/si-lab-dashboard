"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { columns, Practicum } from "./components/practicums-columns"

export default function Practicums() {
    const originalData: Practicum[] = [
        {
            kode: "231640731",
            nama: "Teknologi Mobile",
            deskripsi: "Praktikum Teknologi Mobile",
            sks: 3,
            semester: "Semester Gasal 2023",
        },
        {
            kode: "231612341",
            nama: "Teknologi Web Lanjut",
            deskripsi: "Praktikum Teknologi Web Lanjut",
            sks: 3,
            semester: "Semester Gasal 2023",
        },
    ]

    const [data, setData] = useState<Practicum[]>(originalData)

    const handleAddPracticum = () => {
        const newPracticum: Practicum = {
            kode: "NEW123",
            nama: "New Practicum",
            deskripsi: "New Practicum Description",
            sks: 2,
            semester: "Semester Genap 2024",
        }
        setData([...data, newPracticum])
    }


    const handleSearch = (value: string, searchableColumns: (keyof Practicum)[]) => {
        if (value === "") {
            // If search value is empty, reset to original data
            setData(originalData)
        } else {
            setData((prevData) => {
                return prevData.filter((item) => {
                    return searchableColumns.some((column) => {
                        const columnValue = item[column]?.toString().toLowerCase() ?? ""
                        return columnValue.includes(value.toLowerCase())
                    })
                })
            })
        }
    }

    return (
        <div className="space-y-4">
            <DataTable
                columns={columns}
                data={data}
                buttonText="Add Practicum"
                onButtonClick={handleAddPracticum}
                searchFunction={handleSearch}
                searchableColumns={["kode", "nama", "deskripsi"]}
            />
        </div>
    )
}
