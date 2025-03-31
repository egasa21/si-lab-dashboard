function getCookie(name: string) {
    return document.cookie
        .split("; ")
        .find(row => row.startsWith(name + "="))
        ?.split("=")[1];
}

export function isTokenExpiringSoon(bufferTime = 60) { // bufferTime in seconds
    const expiresAt = parseInt(getCookie("expires_at") || "0", 10);
    const now = Math.floor(Date.now() / 1000);
    
    return expiresAt > 0 && (expiresAt - now) <= bufferTime;
}
