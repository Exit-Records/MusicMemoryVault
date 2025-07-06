export default function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Artist workspace background */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080" 
          alt="Artist workspace with musical instruments and camera equipment" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-light mb-6">
          Music & <span className="font-bold text-accent">Visual</span> Artist
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
          30 years of musical journey and visual storytelling through the lens
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => scrollToSection('music')}
            className="bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-lg transition-colors duration-200"
          >
            Explore Music
          </button>
          <button 
            onClick={() => scrollToSection('photography')}
            className="border border-white/30 hover:bg-white/10 text-white px-8 py-3 rounded-lg transition-colors duration-200"
          >
            View Photography
          </button>
        </div>
      </div>
    </section>
  );
}
