"use client";
import { Zap, Globe, Heart, PlayCircle, Share2 } from "lucide-react";
import Image from 'next/image';
import Logo from '@/public/image/logo.png';
import Link from "next/link";

const cols = [
  { title: "Earn Money", links: ["Like Tasks", "Comment Jobs", "Share Tasks", "Subscribe Offers", "Review Tasks", "Watch & Earn"] },
  { title: "Platform", links: ["How It Works", "Pricing Plans", "Task Dashboard", "Earner Leaderboard", "Referral Program", "Mobile App"] },
  { title: "Company", links: ["About NextShop", "Blog & Tips", "Press Kit", "Careers", "Privacy Policy", "Terms of Service"] },
  { title: "Support", links: ["Help Center", "Contact Us", "Community Forum", "Report an Issue", "API Docs", "Status Page"] },
];

export default function Footer() {
  return (
    <footer className="pt-16 pb-8 bg-white" style={{ borderTop: "1px solid rgba(155,89,182,0.1)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">

            <Link href="/dashboard" className="flex items-center gap-1 mb-4 cursor-pointer">
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

            <p className="text-sm leading-relaxed mb-4" style={{ color: "#6b7280" }}>
              The #1 micro jobs platform for earning real money with social media tasks.
            </p>
            <div className="flex gap-2">
              {[Globe, Heart, PlayCircle, Share2].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-8 h-8 rounded-lg border border-purple-100 bg-purple-50 flex items-center justify-center hover:border-purple-300 transition-colors"
                  style={{ color: "#9b59b6" }}>
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>
          {cols.map(col => (
            <div key={col.title}>
              <h4 className="font-semibold text-sm mb-4"
                style={{ color: "#1a1a2e", fontFamily: "'Space Grotesk',sans-serif" }}>{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(l => (
                  <li key={l}>
                    <a href="#" className="text-xs hover:text-purple-600 transition-colors"
                      style={{ color: "#6b7280" }}>{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: "1px solid rgba(155,89,182,0.08)" }}>
          <p className="text-xs" style={{ color: "#9ca3af" }}>
            © 2025 NextShop. All rights reserved. The micro jobs platform for social media earners.
          </p>
          <div className="flex gap-4">
            {["Privacy", "Terms", "Cookies"].map(l => (
              <a key={l} href="#" className="text-xs hover:text-purple-600 transition-colors"
                style={{ color: "#9ca3af" }}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}