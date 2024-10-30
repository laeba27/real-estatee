"use client";
import { motion } from "framer-motion";
import { ArrowRight, Home as HomeIcon, Building, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/heroimg.jpg"
            alt="Modern home"
            fill
            sizes="100vw"
            quality={100}
            priority 
            className="object-cover brightness-50"
            onError={(e) => {
              console.error('Error loading image:', e);
            }}
          />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl text-white"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Find Your Dream Home
            </h1>
            <p className="text-xl mb-8">
              Discover the perfect property in your favorite location
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  asChild
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg flex items-center gap-2 justify-center font-medium"
                >
                  <Link href="/for-sale">
                    <HomeIcon className="w-5 h-5" />
                    Browse Properties
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  asChild
                  variant="secondary"
                  className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 rounded-lg flex items-center gap-2 justify-center font-medium"
                >
                  <Link href="/rent">
                    <Building className="w-5 h-5" />
                    Rental Properties
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-muted-foreground">
              We provide the best property hunting experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-4">
              Start Your Property Search
            </h2>
            <p className="text-muted-foreground mb-8">
              Find properties in your desired location
            </p>
            
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Enter location..."
                className="flex-1 p-4 border rounded-lg"
              />
              <Button 
                className="bg-primary text-white px-8 py-4 rounded-lg flex items-center gap-2"
              >
                <MapPin className="w-5 h-5" />
                Search
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    icon: <HomeIcon className="w-6 h-6 text-primary" />,
    title: "Wide Range of Properties",
    description: "Browse through thousands of properties that match your criteria."
  },
  {
    icon: <MapPin className="w-6 h-6 text-primary" />,
    title: "Location Based Search",
    description: "Find properties in your preferred location with our advanced map search."
  },
  {
    icon: <Building className="w-6 h-6 text-primary" />,
    title: "Rental & Sale Options",
    description: "Whether you want to buy or rent, we have options for everyone."
  }
];
