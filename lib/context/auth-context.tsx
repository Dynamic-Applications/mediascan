"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";

interface AuthUser {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string;
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
    const { data: session, status } = useSession();

    async function fetchMe() {
        try {
            const r = await fetch("/api/auth/me");
            const data = await r.json();
            if (data.success) setUser(data.user);
        } catch {}
    }

    useEffect(() => {
        fetchMe();
    }, []);

    // re-fetch when Google session becomes available
    useEffect(() => {
        if (status === "authenticated" && !user) {
            fetchMe();
        }
    }, [status]);

    async function signOut() {
        await fetch("/api/auth/signout", { method: "POST" });
        await nextAuthSignOut({ redirect: false });
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
