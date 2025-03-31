export const API_BASE_URL = "http://localhost:8080/v1";

function getCookie(name: string): string | null {
    return document.cookie
        .split("; ")
        .find(row => row.startsWith(`${name}=`))
        ?.split("=")[1] ?? null;
}

export async function login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  
    const result = await response.json();
    if (!response.ok) throw new Error(result.meta.message || "Login failed");
  
    const now = Math.floor(Date.now() / 1000);
    const expiresAt = now + result.data.expiresIn;
  
    document.cookie = `access_token=${result.data.access_token}; path=/; max-age=${result.data.expiresIn}; secure`;
    document.cookie = `refresh_token=${result.data.refresh_token}; path=/; max-age=604800; secure`;
    document.cookie = `expires_at=${expiresAt}; path=/; max-age=${result.data.expiresIn}; secure`;
  
    // Immediately fetch and return user data
    const userResponse = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${result.data.access_token}` },
    });
    
    if (userResponse.ok) {
      const userData = await userResponse.json();
      return userData.data;
    }
  
    return result.data;
  }


export function logout() {
    document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/login";
}

export async function getUser() {
    const token = getCookie("access_token");
    if (!token) return null; 

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        console.warn("User session expired, logging out.");
        logout();
        return null;
    }

    const result = await response.json();
    return result.data;
}


// async function refreshAccessToken() {
//     const refreshToken = getCookie("refresh_token");
//     if (!refreshToken) {
//         console.warn("No refresh token available, logging out.");
//         logout();
//         return null;
//     }

//     const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ refresh_token: refreshToken }),
//     });

//     const result = await response.json();
//     if (!response.ok) {
//         console.warn("Refresh token expired, logging out.");
//         logout();
//         return null;
//     }

//     saveTokens(result.data.access_token, result.data.refresh_token);
//     return result.data.access_token;
// }
