"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, ThumbsUp, MessageCircle, Share2, Bell, Star, Users, TrendingUp, Play } from "lucide-react";
import Logo from '@/public/image/logo.png';
import Image from 'next/image';
import Link from "next/link";

function AnimatedCounter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 2000, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(e * to));
      if (p < 1) requestAnimationFrame(step);
    };
    const t = setTimeout(() => requestAnimationFrame(step), 600);
    return () => clearTimeout(t);
  }, [to]);
  return <span>{count.toLocaleString()}{suffix}</span>;
}

const orbits = [
  { icon: ThumbsUp, label: "Likes", color: "#9b59b6", angle: 0 },
  { icon: MessageCircle, label: "Comments", color: "#1abc9c", angle: 72 },
  { icon: Share2, label: "Shares", color: "#e74c3c", angle: 144 },
  { icon: Bell, label: "Subscribe", color: "#f39c12", angle: 216 },
  { icon: Star, label: "Reviews", color: "#3498db", angle: 288 },
];

export default function Hero() {
  const [angle, setAngle] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setAngle(a => a + 0.35), 16);
    return () => clearInterval(id);
  }, []);

  return (
    // Added pb-24 to ensure content doesn't hit the ticker on mobile mid-130px  60px
    <>
      <section className="relative flex items-center overflow-hidden mesh-bg pt-28 pb-20 lg:pt-24 lg:pb-15"
        aria-label="NexShop Hero – Micro Jobs Platform">

        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
          <div className="absolute rounded-full opacity-20 lg:opacity-100"
            style={{ width: "min(90vw, 700px)", height: "min(90vw, 700px)", border: "1.5px solid rgba(155,89,182,0.08)", animation: "spin-slow 40s linear infinite" }} />
          <div className="absolute top-10 left-0 w-72 h-72 lg:w-96 lg:h-96 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(155,89,182,0.12), transparent 70%)", filter: "blur(50px)" }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full relative z-10 pt-5 lg:pt-32.5">

          {/* LEFT: Copy */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-white border border-purple-200 rounded-full px-4 py-2 mb-6 text-[10px] sm:text-xs font-semibold shadow-sm"
              style={{ color: "#8e44ad" }}>
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse" />
              500,000+ Active Earners Worldwide
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="font-extrabold leading-[1.1] text-[#1a1a2e]"
              style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(2rem, 8vw, 3.6rem)" }}>
              Earn Real Money<br />
              <span className="text-gradient">With Micro Jobs</span><br />
              Online Today
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="mt-6 text-base sm:text-lg leading-relaxed max-w-lg text-[#6b7280]">
              Complete simple social media tasks — likes, comments, shares, subscriptions and more.
              Get paid instantly to your wallet. No skills required, start in minutes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-8 w-full sm:w-auto">
              <Link href="/signup" className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base glow-purple">
                Start Earning Free <ArrowRight size={18} />
              </Link>
              <a href="#how-it-works" className="btn-outline w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-base">
                <Play size={16} fill="#9b59b6" style={{ color: "#9b59b6" }} />
                See How It Works
              </a>
            </motion.div>

            {/* Stats - Grid layout for mobile to prevent squashing */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
              className="grid grid-cols-2 md:flex md:flex-wrap gap-6 sm:gap-10 mt-10 pt-8 w-full border-t border-purple-100 lg:border-none"
              style={{ borderTop: "1.5px solid rgba(155,89,182,0.12)" }}>
              {[
                { val: 500000, suffix: "+", label: "Active Earners" },
                { val: 2500000, suffix: "+", label: "Tasks Completed" },
                { val: 99, suffix: "%", label: "Satisfaction Rate" },
              ].map((s, idx) => (
                <div key={s.label} className={idx === 2 ? "col-span-2 md:col-span-1" : ""}>
                  <div className="text-xl sm:text-2xl font-extrabold text-gradient"
                    style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
                    <AnimatedCounter to={s.val} suffix={s.suffix} />
                  </div>
                  <div className="text-[10px] sm:text-xs mt-0.5 text-[#9ca3af] uppercase tracking-wider font-medium">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT: Orbit (Hidden on smaller screens, optimized for desktop) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:flex items-center justify-center min-h-125">

            {/* Center card */}
            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute z-10 bg-white rounded-3xl p-6 text-center"
              style={{ width: 200, boxShadow: "0 20px 60px rgba(155,89,182,0.2), 0 4px 16px rgba(0,0,0,0.06)", border: "1px solid rgba(155,89,182,0.15)" }}>
              <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3 glow-purple">
                <Image src={Logo} alt="Logo" width={26} height={26} />
              </div>
              <div className="text-sm font-bold text-[#1a1a2e]" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>NexShop</div>
              <div className="text-xs mt-1 text-[#9ca3af]">Micro Jobs Hub</div>
              <div className="mt-3 flex justify-center gap-0.5">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill="#f39c12" style={{ color: "#f39c12" }} />)}
              </div>
              <div className="text-xs mt-1 text-[#9ca3af]">4.9 / 5.0</div>
            </motion.div>

            {/* Orbit rings */}
            {[1, 2].map(i => (
              <div key={i} className="absolute rounded-full"
                style={{ width: i * 200 + 120, height: i * 200 + 120, border: `1px solid rgba(155,89,182,${0.08 / i})`, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
            ))}

            {/* Orbiting icons */}
            {orbits.map((o) => {
              const rad = ((o.angle + angle) * Math.PI) / 180;
              const r = 160;
              const x = Math.cos(rad) * r;
              const y = Math.sin(rad) * r;
              return (
                <div key={o.label} className="absolute"
                  style={{ left: "50%", top: "50%", transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}>
                  <div className="bg-white rounded-2xl p-3 flex flex-col items-center gap-1.5 cursor-pointer transition-transform hover:scale-110"
                    style={{ minWidth: 72, border: `1.5px solid ${o.color}25`, boxShadow: `0 4px 16px ${o.color}18` }}>
                    <o.icon size={22} style={{ color: o.color }} />
                    <span className="text-xs font-semibold text-[#374151]">{o.label}</span>
                  </div>
                </div>
              );
            })}

            {/* Floating badge cards */}
            <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 3.5, repeat: Infinity }}
              className="absolute top-4 right-0 bg-white rounded-xl px-3 py-2 flex items-center gap-2 shadow-lg border border-teal-100">
              <TrendingUp size={14} className="text-[#1abc9c]" />
              <span className="text-xs font-semibold text-[#374151]">+$248 today</span>
            </motion.div>
            <motion.div animate={{ y: [5, -5, 5] }} transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
              className="absolute bottom-8 left-0 bg-white rounded-xl px-3 py-2 flex items-center gap-2 shadow-lg border border-purple-100">
              <Users size={14} className="text-[#9b59b6]" />
              <span className="text-xs font-semibold text-[#374151]">12 new tasks</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Ticker - Adjusted for absolute positioning */}

      </section>
      <div className=" bottom-0 left-0 right-0 overflow-hidden py-3 h-12 flex items-center"
        style={{ background: "rgba(155,89,182,0.06)", borderTop: "1px solid rgba(155,89,182,0.1)" }}>
        <div className="flex animate-ticker whitespace-nowrap">
          {[...Array(4)].map((_, gi) => (
            <div key={gi} className="flex gap-8 px-4">
              {["👍 Like Tasks", "💬 Comment Jobs", "🔁 Share Tasks", "🔔 Subscribe Offers", "⭐ Review Tasks", "💰 Instant Payout"].map((t, i) => (
                <span key={i} className="text-[10px] sm:text-xs flex items-center gap-2 text-[#9ca3af]">
                  <span>{t}</span>
                  <span className="text-purple-300">•</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>

  );
}