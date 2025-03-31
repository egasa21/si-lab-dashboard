"use client"

import { useRouter } from "next/navigation"
import { Practicum } from "../components/practicums-columns"
import { CreatePracticumForm } from "../components/create-practicum-form"


export default function CreatePracticumPage() {
    const router = useRouter()

    const handleSubmit = async (newPracticum: Practicum) => {
        console.log("New Practicum Created:", newPracticum)

        router.push("/dashboard/practicums")
    }

    return (
        <div className="p-0">
            <CreatePracticumForm onSubmit={handleSubmit} />
        </div>
    )
}
