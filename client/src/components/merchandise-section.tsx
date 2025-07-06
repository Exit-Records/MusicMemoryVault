import { ShoppingBag, Shirt, Package, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MerchandiseItem {
  id: number;
  title: string;
  category: string;
  price: string;
  description: string;
  imageUrl: string;
  available: boolean;
}

const merchandiseItems: MerchandiseItem[] = [];

export default function MerchandiseSection() {
  return (
    <section id="merchandise" className="py-20" style={{backgroundColor: '#F3EFE0'}}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light mb-4">Form</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {merchandiseItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-lg">{item.title}</h3>
                  <span className="text-sm text-gray-500 uppercase tracking-wide">{item.category}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-light">{item.price}</span>
                  <button 
                    className={`px-4 py-2 rounded-full text-sm transition-colors flex items-center gap-2 ${
                      item.available 
                        ? 'bg-black text-white hover:bg-gray-800' 
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!item.available}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {item.available ? 'Add to Cart' : 'Sold Out'}
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">All items are carefully crafted and shipped worldwide</p>
          <button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2 mx-auto">
            <Globe className="w-4 h-4" />
            View Full Store
          </button>
        </div>
      </div>
    </section>
  );
}