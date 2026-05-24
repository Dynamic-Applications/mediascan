"use client";

import { useState } from "react";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Link from "next/link";
import { Button } from "./ui/button";

const socialLinks = [
    { icon: FaXTwitter, href: "#", label: "X" },
    { icon: FaGithub, href: "#", label: "GitHub" },
    { icon: FaLinkedin, href: "#", label: "LinkedIn" },
    { icon: FaInstagram, href: "#", label: "Instagram" },
];

const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy", href: "/privacy" },
];

export default function Footer() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.error ?? "Failed to send message");
            } else {
                setSubmitted(true);
                setFormData({ name: "", email: "", message: "" });
            }
        } catch {
            alert("Failed to send message, please try again");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <footer className="bg-background border-t border-border/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <h3 className="text-xl font-serif font-bold text-foreground mb-4">
                            MediaScan
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            Video insights that resonate with curious minds of
                            the digital age, exploring the intersection of
                            technology, design, and creativity.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        target="_blank"
                                        className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span className="sr-only">
                                            {link.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-4">
                            Quick Links
                        </h4>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact form */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-4">
                            Get in Touch
                        </h4>
                        {submitted ? (
                            <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-foreground">
                                Thanks for reaching out! We'll get back to you
                                soon.
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <label
                                            htmlFor="footer-name"
                                            className="text-sm font-medium text-foreground w-20 shrink-0 text-right"
                                        >
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            id="footer-name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="John Doe"
                                            className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <label
                                            htmlFor="footer-email"
                                            className="text-sm font-medium text-foreground w-20 shrink-0 text-right"
                                        >
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="footer-email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="you@example.com"
                                            className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                        />
                                    </div>
                                    <div className="flex items-start gap-3 mb-3">
                                        <label
                                            htmlFor="footer-message"
                                            className="text-sm font-medium text-foreground w-20 shrink-0 text-right pt-2"
                                        >
                                            Message
                                        </label>
                                        <textarea
                                            id="footer-message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={3}
                                            placeholder="Your message..."
                                            className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            disabled={submitting}
                                        >
                                            {submitting
                                                ? "Sending..."
                                                : "Send Message"}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
                    <p>
                        © {new Date().getFullYear()} MediaScan. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
