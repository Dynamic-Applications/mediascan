"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import * as motion from "motion/react-client";
import { TrendingUp, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useProtectedVideo } from "@/lib/hooks/useProtectedVIdeo";

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

export default function QuotesSection() {
    const [trends, setTrends] = useState<VideoItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { handleVideoClick } = useProtectedVideo();

    useEffect(() => {
        fetch("/api/youtube/search?q=trending")
            .then((r) => r.json())
            .then((data) => {
                if (data.success) setTrends(data.items?.slice(0, 6) ?? []);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    function formatDate(dateStr: string) {
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <TrendingUp className="h-6 w-6 text-primary" />
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                            Trending Now
                        </h2>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        What the world is watching right now
                    </p>
                </motion.div>

                {/* Loading skeleton */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
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

                {/* Trends grid */}
                {!loading && trends.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {trends.map((video, index) => (
                            <motion.div
                                key={video.id.videoId}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <a
                                    href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => handleVideoClick(e, video.id.videoId)}
                                    className="block rounded-xl border border-border bg-card overflow-hidden hover:border-foreground/30 hover:shadow-lg transition-all duration-300 group"
                                >
                                    <div className="relative aspect-video w-full overflow-hidden">
                                        <Image
                                            src={video.snippet.thumbnails.medium.url}
                                            alt={video.snippet.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute top-3 left-3">
                                            <Badge
                                                variant="secondary"
                                                className="bg-background/80 backdrop-blur-xs"
                                            >
                                                {video.snippet.channelTitle}
                                            </Badge>
                                        </div>
                                        <div className="absolute top-3 right-3">
                                            <Badge className="bg-primary text-primary-foreground">
                                                #{index + 1}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3
                                            className="text-sm font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors duration-300"
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
            </div>
        </section>
    );
}