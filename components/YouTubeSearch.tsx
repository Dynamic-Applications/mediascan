"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useProtectedVideo } from "@/lib/hooks/useProtectedVideo";

interface VideoItem {
    id: { videoId: string };
    snippet: {
        title: string;
        channelTitle: string;
        publishedAt: string;
        thumbnails: {
            medium: { url: string; width: number; height: number };
        };
    };
}

export default function YouTubeSearch() {
    const [query, setQuery] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [nextPageToken, setNextPageToken] = useState<string | null>(null);
    const [prevPageToken, setPrevPageToken] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { handleVideoClick, isAuthenticated } = useProtectedVideo();

    async function search(q: string, pageToken?: string) {
        if (!q.trim()) return;
        setLoading(true);
        setError("");
        try {
            const params = new URLSearchParams({ q });
            if (pageToken) params.set("pageToken", pageToken);
            const res = await fetch(`/api/youtube/search?${params}`);
            const data = await res.json();
            if (!data.success) {
                setError(data.error ?? "Search failed");
            } else {
                setVideos(data.items ?? []);
                setNextPageToken(data.nextPageToken);
                setPrevPageToken(data.prevPageToken);
            }
        } catch {
            setError("Search failed, please try again");
        } finally {
            setLoading(false);
        }
    }

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        setQuery(inputValue);
        search(inputValue);
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
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                        Search Videos
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                        Search millions of videos from YouTube
                    </p>
                    <form
                        onSubmit={handleSearch}
                        className="flex gap-2 max-w-2xl mx-auto"
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Search videos..."
                            className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        />
                        <button
                            type="submit"
                            disabled={loading || !inputValue.trim()}
                            className="px-6 py-2.5 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {loading ? "Searching..." : "Search"}
                        </button>
                    </form>
                </div>

                {error && (
                    <p className="text-center text-sm text-destructive mb-8">
                        {error}
                    </p>
                )}

                {/* Loading skeleton */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div
                                key={i}
                                className="rounded-xl border border-border overflow-hidden animate-pulse"
                            >
                                <div className="bg-muted aspect-video w-full" />
                                <div className="p-3 space-y-2">
                                    <div className="h-4 bg-muted rounded w-3/4" />
                                    <div className="h-3 bg-muted rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Results */}
                {!loading && videos.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                            {videos.map((video) => (
                                <a
                                    key={video.id.videoId}
                                    href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) =>
                                        handleVideoClick(e, video.id.videoId)
                                    }
                                    className="rounded-xl border border-border bg-card overflow-hidden hover:border-foreground/30 transition-colors group"
                                >
                                    {/* ↓ replace your existing thumbnail div with this */}
                                    <div className="relative aspect-video w-full overflow-hidden">
                                        <Image
                                            src={
                                                video.snippet.thumbnails.medium
                                                    .url
                                            }
                                            alt={video.snippet.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        {!isAuthenticated && (
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <div className="bg-background/90 rounded-full p-2">
                                                    <svg
                                                        className="h-5 w-5 text-foreground"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
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
                                        <h3
                                            className="text-sm font-medium text-foreground line-clamp-2 mb-1"
                                            dangerouslySetInnerHTML={{
                                                __html: video.snippet.title,
                                            }}
                                        />
                                        <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            {formatDate(
                                                video.snippet.publishedAt,
                                            )}
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center gap-3">
                            {prevPageToken && (
                                <button
                                    onClick={() => search(query, prevPageToken)}
                                    className="px-5 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
                                >
                                    Previous
                                </button>
                            )}
                            {nextPageToken && (
                                <button
                                    onClick={() => search(query, nextPageToken)}
                                    className="px-5 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    </>
                )}

                {/* Empty state */}
                {!loading && videos.length === 0 && !error && (
                    <div className="text-center py-0">
                        <p className="text-muted-foreground text-sm">
                            Search for videos to get started
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
