"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface AuthUser {
    id: string;
    email: string;
    name: string;
}

interface AuthContextType {
    user: AuthUser | null;
    setUser: (user: AuthUser | null) => void;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => {},
    signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);

    useEffect(() => {
        fetch("/api/auth/me")
            .then((r) => r.json())
            .then((data) => {
                if (data.success) setUser(data.user);
            })
            .catch(() => {});
    }, []);

    async function signOut() {
        await fetch("/api/auth/signout", { method: "POST" });
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, setUser, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
