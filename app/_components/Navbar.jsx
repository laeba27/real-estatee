"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 bg-white/80 backdrop-blur-md z-50 border-b"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-bold text-xl">
            PropertyFinder
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/for-sale">For Sale</Link>
            <Link href="/rent">Rent</Link>
            <Button>
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar; 