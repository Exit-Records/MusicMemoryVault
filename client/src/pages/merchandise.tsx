import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, Package } from "lucide-react";

interface MerchandiseItem {
  id: number;
  title: string;
  category: string;
  price: string;
  description: string;
  imageUrl: string;
  available: boolean;
}

const categories = [
  { value: "all", label: "All Items" },
  { value: "apparel", label: "Apparel" },
  { value: "vinyl", label: "Vinyl" },
  { value: "accessories", label: "Accessories" },
  { value: "art", label: "Art Prints" },
];

const merchandiseItems: MerchandiseItem[] = [];

export default function MerchandisePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredItems = selectedCategory === "all" 
    ? merchandiseItems 
    : merchandiseItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#F3EFE0] dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-light mb-4 text-black dark:text-[#F3EFE0]">Form</h1>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "secondary"}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-6 py-2 rounded-full transition-colors duration-200 ${
                selectedCategory === category.value
                  ? "bg-black dark:bg-[#F3EFE0] text-white dark:text-black hover:bg-black/90 dark:hover:bg-[#F3EFE0]/90"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Merchandise Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredItems.map((item) => (
            <Card 
              key={item.id} 
              className="group bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                {!item.available && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                      Sold Out
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 text-black dark:text-[#F3EFE0]">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 capitalize">{item.category}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-black dark:text-[#F3EFE0]">{item.price}</span>
                  <Button 
                    disabled={!item.available}
                    className={`flex items-center gap-2 ${
                      item.available 
                        ? "bg-accent hover:bg-accent/90" 
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    {item.available ? (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </>
                    ) : (
                      <>
                        <Package className="w-4 h-4" />
                        Sold Out
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No items found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}