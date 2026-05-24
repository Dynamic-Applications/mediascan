"use client";

import { navItems } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import MobileNavigation from "./MobileNavigation";
import { LoginDialog } from "./auth-dialogs";
import { useAuth } from "@/lib/context/auth-context";

export default function Navigation() {
    const { user, signOut } = useAuth();

    return (
        <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo + user */}
                    <div className="flex-shrink-0">
                        <h1 className="text-xl font-serif font-bold text-foreground">
                            MediaScan
                        </h1>
                        {user && (
                            <div className="flex items-center gap-1.5 mt-1">
                                <div className="h-5 w-5 rounded-full bg-muted overflow-hidden flex items-center justify-center text-[10px] font-semibold text-foreground shrink-0">
                                    {user.avatarUrl ? (
                                        <Image
                                            src={user.avatarUrl}
                                            alt={user.name}
                                            width={20}
                                            height={20}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        user.name.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {user.name}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Desktop navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
                            >
                                {item.name}
                            </Link>
                        ))}

                        {(user?.role === "SuperAdmin" ||
                            user?.role === "Admin") && (
                            <Link
                                href="/admin"
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
                            >
                                Admin
                            </Link>
                        )}

                        {user ? (
                            <button
                                onClick={signOut}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
                            >
                                Sign Out
                            </button>
                        ) : (
                            <LoginDialog
                                trigger={
                                    <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
                                        Login
                                    </button>
                                }
                            />
                        )}

                        <ThemeToggle />
                    </div>

                    {/* Mobile nav */}
                    <MobileNavigation />
                </div>
            </div>
        </nav>
    );
}
