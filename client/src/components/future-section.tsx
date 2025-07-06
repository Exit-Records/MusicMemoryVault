import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";

interface FutureEvent {
  id: number;
  title: string;
  type: "performance" | "exhibition" | "release" | "workshop";
  date: string;
  location: string;
  description: string;
  status: "confirmed" | "tentative" | "announced";
}

const futureEvents: FutureEvent[] = [
  {
    id: 1,
    title: "New Album Release",
    type: "release",
    date: "Spring 2025",
    location: "Digital & Vinyl",
    description: "Third studio album exploring themes of connection and distance in modern life",
    status: "confirmed"
  },
  {
    id: 2,
    title: "Gallery Exhibition",
    type: "exhibition",
    date: "June 2025",
    location: "Downtown Contemporary Gallery",
    description: "Solo photography exhibition featuring 30 years of work across multiple continents",
    status: "announced"
  },
  {
    id: 3,
    title: "Live Performance",
    type: "performance",
    date: "August 2025",
    location: "Outdoor Amphitheater",
    description: "Intimate acoustic set under the stars, featuring songs from across the decades",
    status: "tentative"
  },
  {
    id: 4,
    title: "Creative Workshop",
    type: "workshop",
    date: "Fall 2025",
    location: "Artist Residency Program",
    description: "Teaching photography and music composition to emerging artists",
    status: "tentative"
  }
];

const getTypeColor = (type: string) => {
  switch (type) {
    case "performance": return "bg-blue-100 text-blue-800";
    case "exhibition": return "bg-purple-100 text-purple-800";
    case "release": return "bg-green-100 text-green-800";
    case "workshop": return "bg-orange-100 text-orange-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getStatusIndicator = (status: string) => {
  switch (status) {
    case "confirmed": return "w-2 h-2 bg-green-500 rounded-full";
    case "announced": return "w-2 h-2 bg-blue-500 rounded-full";
    case "tentative": return "w-2 h-2 bg-yellow-500 rounded-full";
    default: return "w-2 h-2 bg-gray-500 rounded-full";
  }
};

export default function FutureSection() {
  return (
    <section id="future" className="py-20" style={{backgroundColor: '#F3EFE0'}}>
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light mb-4">Note</h2>
          <p className="text-gray-600 text-lg">Smell • What's coming next</p>
        </div>

        <div className="space-y-8">
          {futureEvents.map((event) => (
            <div key={event.id} className="group border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={getStatusIndicator(event.status)}></div>
                  <span className={`px-3 py-1 rounded-full text-xs uppercase tracking-wide ${getTypeColor(event.type)}`}>
                    {event.type}
                  </span>
                </div>
                <span className="text-sm text-gray-500 capitalize">{event.status}</span>
              </div>
              
              <h3 className="text-xl font-medium mb-3 group-hover:text-gray-600 transition-colors">
                {event.title}
              </h3>
              
              <div className="flex items-center gap-6 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                {event.description}
              </p>
              
              <div className="flex items-center text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">
            Stay updated on upcoming projects and performances
          </p>
          <button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors">
            Subscribe to Updates
          </button>
        </div>
      </div>
    </section>
  );
}