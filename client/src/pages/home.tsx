import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import MusicSection from "@/components/music-section";
import PhotographySection from "@/components/photography-section";
import AboutSection from "@/components/about-section";
import ContactSection from "@/components/contact-section";
import Lightbox from "@/components/lightbox";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F3EFE0] dark:bg-black transition-colors duration-300">
      <Navigation />
      <HeroSection />
      <MusicSection />
      <PhotographySection />
      <AboutSection />
      <ContactSection />
      <Lightbox />
      
      {/* Footer */}
      <footer className="bg-black dark:bg-[#F3EFE0] text-white dark:text-black py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-2xl font-bold mb-4 md:mb-0">
              Alexandra Chen
            </div>
            <div className="text-gray-400 dark:text-gray-600">
              © 2024 Alexandra Chen. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
