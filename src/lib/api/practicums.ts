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
