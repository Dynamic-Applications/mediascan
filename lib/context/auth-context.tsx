"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import { useRouter } from "next/navigation";

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
    const router = useRouter();

    async function fetchMe() {
        try {
            const r = await fetch("/api/auth/me");
            const data = await r.json();
            if (data.success) setUser(data.user);
            else setUser(null);
        } catch {}
    }

    useEffect(() => {
        fetchMe();
    }, []);

    useEffect(() => {
        if (status === "authenticated" && !user) {
            fetchMe();
        }
        if (status === "unauthenticated") {
            setUser(null);
        }
    }, [status]);

    async function signOut() {
        // clear custom JWT cookie
        await fetch("/api/auth/signout", { method: "POST" });
        // clear NextAuth session (Google)
        await nextAuthSignOut({ redirect: false });
        setUser(null);
        router.push("/");
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
