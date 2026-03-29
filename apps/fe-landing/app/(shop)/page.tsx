import HeroSection from "@/components/content/HeroSection";
import WhyChooseUs from "@/components/content/WhyChooseUs";
import ProductCarousel from "@/components/content/ProductCarousel";
import FeaturedCollections from "@/components/content/FeaturedCollections";
import OurStory from "@/components/content/OurStory";
import PriceListSection from "@/components/content/PriceListSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <FeaturedCollections />
      <ProductCarousel />
      {/* <MetalPriceSection /> */}
      <PriceListSection />
      <WhyChooseUs />
      <OurStory />
    </main>
  );
}
