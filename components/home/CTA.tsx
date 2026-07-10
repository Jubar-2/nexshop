"use client";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-24 px-6 bg-white" aria-label="Join NextShop and Start Earning from Micro Jobs">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} transition={{ duration:0.6 }}
          className="relative rounded-3xl px-7.5 py-12 md:p-12 text-center overflow-hidden"
          style={{ background:"linear-gradient(135deg, #f8f2fe 0%, #f0fdfb 100%)", border:"1.5px solid rgba(155,89,182,0.2)", boxShadow:"0 20px 60px rgba(155,89,182,0.1)" }}>
          {/* Decorative */}
          <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full"
            style={{ background:"radial-gradient(circle, rgba(155,89,182,0.15), transparent 70%)", filter:"blur(30px)" }} />
          <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full"
            style={{ background:"radial-gradient(circle, rgba(26,188,156,0.12), transparent 70%)", filter:"blur(30px)" }} />

          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl btn-primary flex items-center justify-center mx-auto mb-6 glow-purple">
              <Zap size={28} fill="white" />
            </div>
            <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(1.8rem,4vw,2.8rem)", fontWeight:800, color:"#1a1a2e" }}>
              Ready to Start Earning<br /><span className="text-gradient">with Micro Jobs?</span>
            </h2>
            <p className="mt-4 text-base max-w-lg mx-auto" style={{ color:"#6b7280" }}>
              Join 500,000+ earners who complete social media tasks and get paid daily on NexShop.
              Free signup, instant access, real money.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <motion.a href="#" whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }}
                className="btn-primary flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base glow-purple">
                Create Free Account <ArrowRight size={18} />
              </motion.a>
              <motion.a href="#services" whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }}
                className="btn-outline flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base">
                Browse Tasks First
              </motion.a>
            </div>
            <p className="mt-4 text-xs" style={{ color:"#9ca3af" }}>
              No credit card required • Free forever plan available • Withdraw anytime
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}