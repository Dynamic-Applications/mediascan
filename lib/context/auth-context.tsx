"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

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
    const { data: session } = useSession();

    useEffect(() => {
        // check our own JWT cookie first
        fetch("/api/auth/me")
            .then((r) => r.json())
            .then((data) => {
                if (data.success) setUser(data.user);
            })
            .catch(() => {});
    }, []);

    // sync Google session
    useEffect(() => {
        if (session?.user?.email && !user) {
            fetch("/api/auth/me")
                .then((r) => r.json())
                .then((data) => {
                    if (data.success) setUser(data.user);
                })
                .catch(() => {});
        }
    }, [session]);

    async function signOut() {
        await fetch("/api/auth/signout", { method: "POST" });
        const { signOut: nextAuthSignOut } = await import("next-auth/react");
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
