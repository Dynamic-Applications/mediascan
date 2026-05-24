"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/context/auth-context";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface AdminUser {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string;
    role: "user" | "admin" | "superadmin";
    createdAt: string;
}

export default function AdminPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updating, setUpdating] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;
        if (user.role !== "superadmin") {
            router.push("/");
            return;
        }
        fetch("/api/admin/users")
            .then((r) => r.json())
            .then((data) => {
                if (data.success) setUsers(data.data);
                else setError("Failed to load users");
            })
            .catch(() => setError("Failed to load users"))
            .finally(() => setLoading(false));
    }, [user, router]);

    async function handleRoleChange(id: string, newRole: "user" | "admin") {
        setUpdating(id);
        try {
            const res = await fetch(`/api/admin/users/${id}/role`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole }),
            });
            const data = await res.json();
            if (data.success) {
                setUsers((prev) =>
                    prev.map((u) =>
                        u.id === id ? { ...u, role: newRole } : u,
                    ),
                );
            } else {
                setError(data.error ?? "Failed to update role");
            }
        } catch {
            setError("Failed to update role");
        } finally {
            setUpdating(null);
        }
    }

    if (!user || user.role !== "superadmin") return null;

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-16 flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Loading...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground">
                    User Management
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    {users.length} total users
                </p>
            </div>

            {error && <p className="text-sm text-destructive mb-4">{error}</p>}

            <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border bg-muted/50">
                            <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-6 py-3">
                                User
                            </th>
                            <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-6 py-3">
                                Email
                            </th>
                            <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-6 py-3">
                                Role
                            </th>
                            <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-6 py-3">
                                Joined
                            </th>
                            <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-6 py-3">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u, i) => (
                            <tr
                                key={u.id}
                                className={`border-b border-border last:border-0 ${i % 2 === 0 ? "bg-background" : "bg-muted/20"}`}
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-muted overflow-hidden flex items-center justify-center text-sm font-semibold text-foreground shrink-0">
                                            {u.avatarUrl ? (
                                                <Image
                                                    src={u.avatarUrl}
                                                    alt={u.name}
                                                    width={32}
                                                    height={32}
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                u.name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <span className="text-sm font-medium text-foreground">
                                            {u.name}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-muted-foreground">
                                        {u.email}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                                            u.role === "superadmin"
                                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                                                : u.role === "admin"
                                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                                  : "bg-muted text-muted-foreground"
                                        }`}
                                    >
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-muted-foreground">
                                        {new Date(
                                            u.createdAt,
                                        ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {u.role === "superadmin" ? (
                                        <span className="text-xs text-muted-foreground">
                                            —
                                        </span>
                                    ) : (
                                        <select
                                            value={u.role}
                                            disabled={updating === u.id}
                                            onChange={(e) =>
                                                handleRoleChange(
                                                    u.id,
                                                    e.target.value as
                                                        | "user"
                                                        | "admin",
                                                )
                                            }
                                            className="text-sm border border-border rounded-md px-2 py-1 bg-background text-foreground disabled:opacity-50"
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
