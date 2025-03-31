"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getUser, logout } from "@/lib/api/auth";

interface AuthContextType {
    user: any | null;
    loading: boolean;
    logout: () => void;
    setUser: (user: any) => void; // Add this line
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    async function refreshUser() {
        setLoading(true);
        const userData = await getUser();
        setUser(userData);
        setLoading(false);
    }

    useEffect(() => {
        refreshUser();
        console.log("called");
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
}