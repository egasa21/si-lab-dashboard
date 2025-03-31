import { API_BASE_URL } from "./auth";
import { getCookie } from "./auth";

export async function getPracticums() {
    const token = getCookie("access_token");
    if (!token) throw new Error("No access token available.");

    const response = await fetch(`${API_BASE_URL}/practicums`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.meta?.message || "Failed to fetch practicums");
    }

    const result = await response.json();
    return result.data;
}


export async function createPracticum(data: {
    code: string;
    name: string;
    description: string;
    credits: string;
    semester: string;
}) {
    const token = getCookie("access_token");
    if (!token) throw new Error("Unauthorized: No access token found");

    const response = await fetch(`${API_BASE_URL}/practicums`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.meta?.message || "Failed to create practicum");
    }

    return result.data;
}