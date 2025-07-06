import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="text-2xl font-bold text-primary">
            Alexandra Chen
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <button 
              onClick={() => scrollToSection('music')}
              className="text-neutral hover:text-accent transition-colors duration-200"
            >
              Music
            </button>
            <button 
              onClick={() => scrollToSection('photography')}
              className="text-neutral hover:text-accent transition-colors duration-200"
            >
              Photography
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-neutral hover:text-accent transition-colors duration-200"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-neutral hover:text-accent transition-colors duration-200"
            >
              Contact
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-neutral"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection('music')}
                className="text-neutral hover:text-accent transition-colors duration-200 text-left"
              >
                Music
              </button>
              <button 
                onClick={() => scrollToSection('photography')}
                className="text-neutral hover:text-accent transition-colors duration-200 text-left"
              >
                Photography
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-neutral hover:text-accent transition-colors duration-200 text-left"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-neutral hover:text-accent transition-colors duration-200 text-left"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
