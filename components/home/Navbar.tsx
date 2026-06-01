"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from 'next/image';
import Logo from '@/public/image/logo.png';

const links = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Services", href: "#services", hasDropdown: true },
  { label: "Pricing", href: "#pricing" },
  { label: "Earners", href: "#earners" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-purple-100 py-3"
        : "py-5 bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        {/* <a href="#" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center glow-purple">
            <Zap size={16} fill="white" />
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20 }}>
            <span className="text-gradient">Next</span>
            <span style={{ color: "#1a1a2e" }}>Shop</span>
          </span>
        </a> */}

        <Link href="/dashboard" className="flex items-center gap-1 cursor-pointer">
          {/* <div className="bg-white rounded-full p-1.5 flex items-center justify-center w-10.5 h-10.5">
            
          </div> */}
          <div className="bg-white rounded-full p-1.5 flex items-center justify-center glow-purple">
            <Image src={Logo} alt="Logo" width={24} height={24} />
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20 }}>
            <span className="text-gradient">Next</span>
            <span style={{ color: "#1a1a2e" }}>Shop</span>
          </span>
          {/* <div className="flex flex-col leading-none">
            <span className="text-xl font-bold text-white tracking-tight font-poppins italic lowercase">NEXSHOP</span>
          </div> */}
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.label} href={l.href}
              className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-purple-600"
              style={{ color: "#6b7280" }}>
              {l.label}
              {l.hasDropdown && <ChevronDown size={14} />}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/signin" className="text-sm font-medium px-4 py-2 rounded-lg transition-colors hover:text-purple-600"
            style={{ color: "#6b7280" }}>Sign In</Link>

          <Link href="/signup"
            className="btn-primary text-sm px-5 py-2.5 rounded-xl font-semibold glow-purple"
          >
            Start Earning Free
          </Link>


        </div>

        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} style={{ color: "#1a1a2e" }} /> : <Menu size={22} style={{ color: "#1a1a2e" }} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-purple-100 px-6 py-4 flex flex-col gap-4"
          >
            {links.map((l) => (
              <a key={l.label} href={l.href}
                className="text-sm font-medium py-1 text-gray-600 hover:text-purple-600"
                onClick={() => setMobileOpen(false)}>{l.label}</a>
            ))}
            <Link href="/signup" className="btn-primary text-sm px-5 py-2.5 rounded-xl font-semibold text-center">
              Start Earning Free
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}