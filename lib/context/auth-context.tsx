"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
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

const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes
const ACTIVITY_EVENTS = [
    "mousemove",
    "mousedown",
    "keydown",
    "touchstart",
    "scroll",
    "click",
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const { data: session, status } = useSession();
    const router = useRouter();
    const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    async function fetchMe() {
        try {
            const r = await fetch("/api/auth/me");
            const data = await r.json();
            if (data.success) setUser(data.user);
            else setUser(null);
        } catch {}
    }

    async function signOut() {
        clearInactivityTimer();
        // sign out from NextAuth first — this invalidates the session server-side
        await nextAuthSignOut({ redirect: false });
        // then clear our custom JWT
        await fetch("/api/auth/signout", { method: "POST" });
        setUser(null);
        // hard redirect to flush any cached React state
        window.location.href = "/";
    }

    function clearInactivityTimer() {
        if (inactivityTimer.current) {
            clearTimeout(inactivityTimer.current);
            inactivityTimer.current = null;
        }
    }

    function resetInactivityTimer() {
        clearInactivityTimer();
        inactivityTimer.current = setTimeout(() => {
            signOut();
        }, INACTIVITY_TIMEOUT);
    }

    // start/stop inactivity timer based on user state
    useEffect(() => {
        if (!user) {
            clearInactivityTimer();
            return;
        }

        // start timer and listen for activity
        resetInactivityTimer();
        ACTIVITY_EVENTS.forEach((e) =>
            window.addEventListener(e, resetInactivityTimer),
        );

        return () => {
            clearInactivityTimer();
            ACTIVITY_EVENTS.forEach((e) =>
                window.removeEventListener(e, resetInactivityTimer),
            );
        };
    }, [user]);

    // fetch on mount
    useEffect(() => {
        fetchMe();
    }, []);

    // sync with NextAuth session
    useEffect(() => {
        if (status === "authenticated" && !user) {
            fetchMe();
        }
        if (status === "unauthenticated") {
            setUser(null);
        }
    }, [status]);

    // poll /api/auth/me every 2 minutes to catch server-side session expiry
    useEffect(() => {
        if (!user) return;
        const interval = setInterval(
            async () => {
                const r = await fetch("/api/auth/me");
                const data = await r.json();
                if (!data.success) {
                    await signOut();
                }
            },
            2 * 60 * 1000,
        );
        return () => clearInterval(interval);
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, setUser, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
