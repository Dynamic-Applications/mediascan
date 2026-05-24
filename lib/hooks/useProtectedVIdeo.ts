"use client";

import React from "react";
import { useAuth } from "@/lib/context/auth-context";

export function useProtectedVideo() {
    const { user } = useAuth();

    function handleVideoClick(e: React.MouseEvent, videoId: string) {
        if (!user) {
            e.preventDefault();
            // store intended URL so we can redirect after login
            sessionStorage.setItem(
                "redirectAfterLogin",
                `https://www.youtube.com/watch?v=${videoId}`,
            );
            // open login dialog by dispatching a custom event
            window.dispatchEvent(new CustomEvent("open-login-dialog"));
        }
        // if logged in, let the link open normally
    }

    return { handleVideoClick, isAuthenticated: !!user };
}
