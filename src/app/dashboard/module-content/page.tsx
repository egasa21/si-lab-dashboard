"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { getModuleContents, deleteModuleContent } from "@/lib/api/module-content";

export type ModuleContent = {
    id: string;
    module_name: string;
    title: string;
    content: string;
    sequence: number;
    created_at: string;
    updated_at: string;
};

export default function ModuleContents() {
    const router = useRouter();
    const [data, setData] = useState<ModuleContent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Dummy HTML content
    const fetchDummyData = async () => {
        setLoading(true);
        try {
            const modules = [
                {
                    id: "1",
                    module_name: "Introduction",
                    title: "Getting Started with Programming",
                    content: "<p>Welcome to the course! Let's learn the basics of programming.</p>",
                    sequence: 1,
                    created_at: "2024-03-01",
                    updated_at: "2024-03-05",
                },
                {
                    id: "2",
                    module_name: "JavaScript Basics",
                    title: "Understanding Variables",
                    content: "<p>Variables are used to store data. In JavaScript, you can use <code>let</code> or <code>const</code>.</p>",
                    sequence: 2,
                    created_at: "2024-03-02",
                    updated_at: "2024-03-06",
                },
            ];
            setData(modules);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDummyData();
    }, []);

    const handleEdit = (id: string) => {
        router.push(`/dashboard/module-content/${id}/edit`);
    };

    const handleDelete = async (id: string) => {
        if (!id) {
            alert("Error: Module ID is missing.");
            return;
        }

        const confirmDelete = window.confirm(`Are you sure you want to delete this module?`);
        if (!confirmDelete) return;

        try {
            // await deleteModuleContent(id);
            setData((prevData) => prevData.filter((item) => item.id !== id));
        } catch (err: any) {
            alert("Failed to delete: " + err.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="space-y-4">
            <Button onClick={() => router.push("/dashboard/module-content/create")}>Add Module</Button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.map((module) => (
                    <Card key={module.id}>
                        <CardHeader>
                            <CardTitle>{module.title}</CardTitle>
                            <p className="text-sm text-gray-500">Module: {module.module_name}</p>
                        </CardHeader>
                        <CardContent>
                            <div dangerouslySetInnerHTML={{ __html: module.content }} />
                            <div className="flex gap-2 mt-4">
                                <Button onClick={() => handleEdit(module.id)}>Edit</Button>
                                <Button variant="destructive" onClick={() => handleDelete(module.id)}>Delete</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
