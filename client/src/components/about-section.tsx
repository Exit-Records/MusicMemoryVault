export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&h=800" 
              alt="Artist workspace featuring musical instruments, camera equipment, and creative setup" 
              className="rounded-xl shadow-2xl"
            />
          </div>
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">The Journey</h2>
            <p className="text-lg text-neutral mb-6">
              For over three decades, I've been documenting life through two lenses: musical composition and visual storytelling. What started as a passion for capturing the world's rhythms has evolved into a dual journey of sonic and visual exploration.
            </p>
            <p className="text-lg text-neutral mb-6">
              My music spans genres from intimate acoustic folk to electronic experimentation, while my photography captures everything from urban landscapes to intimate portraits. Both mediums share a common thread: the pursuit of authentic moments and emotions.
            </p>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="font-bold text-2xl text-accent">30+</h4>
                <p className="text-neutral">Years Creating</p>
              </div>
              <div>
                <h4 className="font-bold text-2xl text-accent">12</h4>
                <p className="text-neutral">Albums Released</p>
              </div>
              <div>
                <h4 className="font-bold text-2xl text-accent">500+</h4>
                <p className="text-neutral">Photos Exhibited</p>
              </div>
              <div>
                <h4 className="font-bold text-2xl text-accent">25</h4>
                <p className="text-neutral">Countries Visited</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
