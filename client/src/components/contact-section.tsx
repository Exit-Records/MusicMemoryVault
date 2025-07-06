import { useState } from "react";
import { Mail, Phone, MapPin, Instagram, Youtube, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ListMusic } from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "Thank you for your message! I'll get back to you soon.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="contact" className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Let's Connect</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Whether you're interested in collaborations, licensing, or just want to share your thoughts on the work
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <Mail className="text-accent w-5 h-5" />
                <span>alexandra.chen@example.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-accent w-5 h-5" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="text-accent w-5 h-5" />
                <span>San Francisco, CA</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition-colors duration-200">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition-colors duration-200">
                <ListMusic className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition-colors duration-200">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                <Input 
                  type="text" 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white focus:ring-accent focus:border-accent"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                <Input 
                  type="email" 
                  id="email" 
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white focus:ring-accent focus:border-accent"
                  required
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
                <Select value={formData.subject} onValueChange={(value) => handleChange('subject', value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="collaboration">Music Collaboration</SelectItem>
                    <SelectItem value="licensing">Photography Licensing</SelectItem>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="press">Press/Media</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                <Textarea 
                  id="message" 
                  rows={4}
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white focus:ring-accent focus:border-accent"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-accent hover:bg-accent/90 text-white py-3 rounded-lg transition-colors duration-200"
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
