import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
            { protocol: "https", hostname: "images.pexels.com" },
        { protocol: "https", hostname: "lh3.googleusercontent.com" },
            { protocol: "https", hostname: "i.ytimg.com" },
        ],
    },
};

export default nextConfig;
