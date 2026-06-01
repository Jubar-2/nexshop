"use client";
import { motion } from "framer-motion";
import { UserCheck, Search, CheckCircle, DollarSign } from "lucide-react";

const steps = [
  { icon: UserCheck,   step:"01", title:"Create Your Free Account", desc:"Sign up in under 60 seconds. No credit card required. Instantly access hundreds of live tasks.", color:"#9b59b6" },
  { icon: Search,      step:"02", title:"Browse & Pick Tasks",       desc:"Filter micro jobs by category, pay rate, and difficulty. Likes, comments, shares, and more.", color:"#1abc9c" },
  { icon: CheckCircle, step:"03", title:"Complete & Submit",         desc:"Follow simple task instructions and submit proof. Tasks take 30 seconds to 5 minutes each.", color:"#3498db" },
  { icon: DollarSign,  step:"04", title:"Get Paid Instantly",        desc:"Earnings go straight to your wallet. Withdraw to PayPal, bank transfer, or crypto anytime.", color:"#f39c12" },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white" aria-label="How NextShop Micro Jobs Work">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} className="text-center mb-16">
          <span className="bg-purple-50 border border-purple-100 text-xs font-semibold px-4 py-2 rounded-full inline-block mb-4"
            style={{ color:"#9b59b6" }}>⚡ Simple 4-Step Process</span>
          <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(1.8rem,4vw,2.8rem)", fontWeight:800, color:"#1a1a2e" }}>
            Start Earning in <span className="text-gradient">4 Easy Steps</span>
          </h2>
          <p className="mt-4 max-w-lg mx-auto" style={{ color:"#6b7280" }}>
            No experience needed. NextShop is designed to get you earning from your very first minute.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* connector */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5"
            style={{ background:"linear-gradient(90deg,#9b59b6,#1abc9c)", opacity:0.3 }} />
          {steps.map((s, i) => (
            <motion.div key={s.step}
              initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ duration:0.5, delay:i*0.12 }}
              className="relative text-center">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center bg-white shadow-card"
                  style={{ border:`2px solid ${s.color}20` }}>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background:`${s.color}12` }}>
                    <s.icon size={26} style={{ color:s.color }} />
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background:s.color, fontFamily:"'Space Grotesk',sans-serif" }}>{i+1}</div>
              </div>
              <h3 className="font-bold text-base mb-2"
                style={{ fontFamily:"'Space Grotesk',sans-serif", color:"#1a1a2e" }}>{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color:"#6b7280" }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}