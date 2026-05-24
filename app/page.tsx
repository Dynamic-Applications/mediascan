"use client";

// import HeroSection from "@/components/HeroSection";
// import FeaturedSection from "@/components/FeaturedSection";
import CategoriesSection from "@/components/CategoriesSection";
import QuotesSection from "@/components/QuotesSection";
import YouTubeSearch from "@/components/YouTubeSearch";

export default function HomePage() {
    return (
        <>
            {/* <HeroSection /> */}
            <YouTubeSearch />
            {/* <FeaturedSection /> */}
            <QuotesSection />
            <CategoriesSection />
        </>
    );
}