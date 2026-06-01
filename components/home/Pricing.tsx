"use client";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
  {
    name:"Free Earner", price:"$0", period:"forever",
    desc:"Perfect for getting started with micro jobs and building your earnings.",
    color:"#6b7280", bg:"#ffffff",
    features:["Access 20+ task categories","Up to 50 tasks per day","Standard pay rates","Weekly payouts ($10 min)","Basic support"],
    cta:"Start Free", popular:false,
  },
  {
    name:"Pro Earner", price:"$9.99", period:"per month",
    desc:"Unlock premium tasks with higher pay rates and priority access.",
    color:"#9b59b6", bg:"linear-gradient(135deg,#faf7fd,#f3ecfc)",
    features:["Access all 50+ task categories","Unlimited daily tasks","2× higher pay on premium tasks","Daily payouts ($5 min)","Priority task queue","Dedicated support"],
    cta:"Go Pro", popular:true,
  },
  {
    name:"Agency", price:"$49.99", period:"per month",
    desc:"Manage a team of earners and maximize group revenue.",
    color:"#1abc9c", bg:"#ffffff",
    features:["Everything in Pro","Up to 20 sub-accounts","Team earnings dashboard","Instant payouts (no minimum)","Bulk task assignment","API access","Account manager"],
    cta:"Contact Sales", popular:false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 section-alt" aria-label="NextShop Pricing Plans">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} className="text-center mb-16">
          <span className="bg-white border border-purple-100 text-xs font-semibold px-4 py-2 rounded-full inline-block mb-4 shadow-sm"
            style={{ color:"#9b59b6" }}>💎 Transparent Pricing</span>
          <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(1.8rem,4vw,2.8rem)", fontWeight:800, color:"#1a1a2e" }}>
            Choose Your <span className="text-gradient">Earning Plan</span>
          </h2>
          <p className="mt-4 max-w-lg mx-auto" style={{ color:"#6b7280" }}>
            Start free and upgrade anytime. Every plan includes access to real micro jobs with instant payouts.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 items-center">
          {plans.map((p, i) => (
            <motion.div key={p.name}
              initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ duration:0.5, delay:i*0.1 }}
              className={`rounded-2xl p-7 relative ${p.popular?"shadow-card-hover":"shadow-card"}`}
              style={{
                background:p.bg,
                border:p.popular?"1.5px solid rgba(155,89,182,0.35)":"1px solid rgba(155,89,182,0.1)",
                transform:p.popular?"scale(1.04)":"scale(1)",
              }}>
              {p.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold text-white"
                  style={{ background:"linear-gradient(135deg,#9b59b6,#8e44ad)" }}>
                  ⚡ Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-1"
                  style={{ fontFamily:"'Space Grotesk',sans-serif", color:"#1a1a2e" }}>{p.name}</h3>
                <p className="text-sm mb-4" style={{ color:"#6b7280" }}>{p.desc}</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-extrabold"
                    style={{ fontFamily:"'Space Grotesk',sans-serif", color:p.color }}>{p.price}</span>
                  <span className="text-sm pb-1.5" style={{ color:"#9ca3af" }}>/{p.period}</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {p.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color:"#374151" }}>
                    <Check size={15} className="mt-0.5 shrink-0" style={{ color:p.color }} />
                    {f}
                  </li>
                ))}
              </ul>
              <motion.a href="#" whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                className={`w-full block text-center py-3 rounded-xl font-semibold text-sm ${p.popular?"btn-primary glow-purple":"btn-outline"}`}>
                {p.cta}
              </motion.a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}