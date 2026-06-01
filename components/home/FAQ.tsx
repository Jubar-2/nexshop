"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q:"What are micro jobs on NextShop?", a:"Micro jobs are small, simple social media tasks like liking posts, writing comments, sharing content, subscribing to channels, and following accounts. Each task pays a small amount — complete many tasks daily to build meaningful income." },
  { q:"How much money can I earn with social media micro jobs?", a:"Earnings vary by task type. Like tasks pay $0.05–$0.50 each, comment jobs $0.20–$2.00, and review tasks up to $5.00. Active earners on NextShop make $100–$600+ per month working part-time." },
  { q:"Is NextShop legitimate? When and how do I get paid?", a:"Yes, NextShop is a verified platform with $8M+ paid out globally. Free earners receive weekly payouts and Pro earners get daily payouts. Withdrawal methods include PayPal, bank transfer, and cryptocurrency." },
  { q:"Do I need any experience or special skills?", a:"No experience is needed. If you have a smartphone or computer and social media accounts, you can complete tasks on NextShop. We provide clear instructions for every task type." },
  { q:"Which social media platforms are supported?", a:"NextShop supports tasks across YouTube, Instagram, TikTok, Twitter/X, Facebook, LinkedIn, Reddit, Twitch, Pinterest, Google, and many more. New platforms are added regularly." },
  { q:"Is there a minimum withdrawal amount?", a:"Free plan earners can withdraw from $10. Pro earners can withdraw from $5. Agency plan members have no minimum. All withdrawals are processed within 24 hours on business days." },
];

export default function FAQ() {
  const [open, setOpen] = useState<number|null>(0);
  return (
    <section className="py-24 section-alt" aria-label="Frequently Asked Questions about NextShop Micro Jobs">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} className="text-center mb-14">
          <span className="bg-teal-50 border border-teal-100 text-xs font-semibold px-4 py-2 rounded-full inline-block mb-4"
            style={{ color:"#0d9488" }}>❓ Common Questions</span>
          <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(1.8rem,4vw,2.6rem)", fontWeight:800, color:"#1a1a2e" }}>
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <motion.div key={i}
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ delay:i*0.07 }}
              className="rounded-2xl overflow-hidden bg-white"
              style={{ border:open===i?"1.5px solid rgba(155,89,182,0.3)":"1px solid rgba(155,89,182,0.1)", boxShadow:open===i?"0 4px 20px rgba(155,89,182,0.1)":"none" }}>
              <button className="w-full flex items-center justify-between px-6 py-4 text-left"
                onClick={() => setOpen(open===i ? null : i)}>
                <span className="font-semibold text-sm pr-4" style={{ color:"#1a1a2e" }}>{f.q}</span>
                <motion.div animate={{ rotate:open===i?180:0 }} transition={{ duration:0.25 }}>
                  <ChevronDown size={18} style={{ color:"#9b59b6", flexShrink:0 }} />
                </motion.div>
              </button>
              <AnimatePresence>
                {open===i && (
                  <motion.div initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }}
                    exit={{ height:0, opacity:0 }} transition={{ duration:0.3 }}>
                    <p className="px-6 pb-5 text-sm leading-relaxed" style={{ color:"#6b7280" }}>{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}