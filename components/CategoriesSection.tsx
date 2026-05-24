"use client";

import { useState } from "react";
import * as motion from "motion/react-client";
import { categories } from "@/lib/data";
import { Badge } from "./ui/badge";
import Image from "next/image";
import { Calendar, X } from "lucide-react";

interface VideoItem {
    id: { videoId: string };
    snippet: {
        title: string;
        channelTitle: string;
        publishedAt: string;
        thumbnails: {
            medium: { url: string };
        };
    };
}

export default function CategoriesSection() {
    const allCategories = categories;
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleCategoryClick(categoryName: string) {
        if (selectedCategory === categoryName) {
            setSelectedCategory(null);
            setVideos([]);
            return;
        }

        setSelectedCategory(categoryName);
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(categoryName)}`);
            const data = await res.json();
            if (data.success) {
                setVideos(data.items?.slice(0, 8) ?? []);
            } else {
                setError("Failed to load videos");
            }
        } catch {
            setError("Failed to load videos");
        } finally {
            setLoading(false);
        }
    }

    function formatDate(dateStr: string) {
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                        Explore Topics
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Dive into the subjects that spark curiosity and drive
                        innovation in our digital world.
                    </p>
                </motion.div>

                {/* Category pills */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
                    {allCategories.map((category, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            key={category.name}
                        >
                            <div
                                className="group cursor-pointer"
                                onClick={() => handleCategoryClick(category.name)}
                            >
                                <div className={`rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border ${
                                    selectedCategory === category.name
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-card border-border/50"
                                }`}>
                                    <div className="mb-4">
                                        <div
                                            dangerouslySetInnerHTML={{ __html: category.icon }}
                                            className={`w-8 h-8 mx-auto group-hover:scale-110 transition-transform duration-300 ${
                                                selectedCategory === category.name
                                                    ? "text-primary-foreground"
                                                    : "text-primary"
                                            }`}
                                        />
                                    </div>
                                    <h3 className={`font-semibold mb-2 transition-colors duration-300 ${
                                        selectedCategory === category.name
                                            ? "text-primary-foreground"
                                            : "text-foreground group-hover:text-primary"
                                    }`}>
                                        {category.name}
                                    </h3>
                                    <Badge
                                        variant="outline"
                                        className={`text-xs ${
                                            selectedCategory === category.name
                                                ? "border-primary-foreground text-primary-foreground"
                                                : ""
                                        }`}
                                    >
                                        {category.count} posts
                                    </Badge>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Videos for selected category */}
                {selectedCategory && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-serif font-bold text-foreground">
                                {selectedCategory} Videos
                            </h3>
                            <button
                                onClick={() => { setSelectedCategory(null); setVideos([]); }}
                                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="h-4 w-4" />
                                Close
                            </button>
                        </div>

                        {/* Loading skeleton */}
                        {loading && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="rounded-xl border border-border overflow-hidden animate-pulse">
                                        <div className="bg-muted aspect-video w-full" />
                                        <div className="p-3 space-y-2">
                                            <div className="h-4 bg-muted rounded w-3/4" />
                                            <div className="h-3 bg-muted rounded w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {error && (
                            <p className="text-sm text-destructive text-center">{error}</p>
                        )}

                        {!loading && videos.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {videos.map((video, index) => (
                                    <motion.div
                                        key={video.id.videoId}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.05 }}
                                    >
                                        <a
                                            href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block rounded-xl border border-border bg-card overflow-hidden hover:border-foreground/30 hover:shadow-lg transition-all duration-300 group"
                                        >
                                            <div className="relative aspect-video w-full overflow-hidden">
                                                <Image
                                                    src={video.snippet.thumbnails.medium.url}
                                                    alt={video.snippet.title}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 25vw"
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute top-2 left-2">
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-background/80 backdrop-blur-xs text-xs"
                                                    >
                                                        {video.snippet.channelTitle}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="p-3">
                                                <h4
                                                    className="text-sm font-medium text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors duration-300"
                                                    dangerouslySetInnerHTML={{ __html: video.snippet.title }}
                                                />
                                                <div className="flex items-center text-xs text-muted-foreground">
                                                    <Calendar className="h-3 w-3 mr-1" />
                                                    {formatDate(video.snippet.publishedAt)}
                                                </div>
                                            </div>
                                        </a>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </section>
    );
}