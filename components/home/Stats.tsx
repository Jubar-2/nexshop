"use client";
import { motion } from "framer-motion";
import { Users, Briefcase, DollarSign, Globe } from "lucide-react";

const stats = [
  { icon: Users, val: "500K+", label: "Registered Earners", sub: "from 120+ countries", color: "#9b59b6" },
  { icon: Briefcase, val: "2.5M+", label: "Tasks Completed", sub: "every month", color: "#1abc9c" },
  { icon: DollarSign, val: "$8M+", label: "Total Paid Out", sub: "to workers globally", color: "#f39c12" },
  { icon: Globe, val: "120+", label: "Countries Served", sub: "worldwide access", color: "#3498db" },
];

export default function Stats() {
  return (
    <section className="py-16" aria-label="NextShop Platform Statistics">
      <div className="max-w-7xl mx-auto px-6">
        <div className="rounded-3xl p-10"
          style={{ background: "linear-gradient(135deg, rgba(155,89,182,0.12) 0%, rgba(26,188,156,0.08) 100%)", border: "1px solid rgba(155,89,182,0.2)" }}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                  style={{ background: `${s.color}18` }}>
                  <s.icon size={22} style={{ color: s.color }} />
                </div>
                <div className="text-3xl font-extrabold text-gradient mb-1"
                  style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{s.val}</div>
                <div className="text-sm font-semibold" style={{ color: "#f0f0f8" }}>{s.label}</div>
                <div className="text-xs mt-0.5" style={{ color: "#8b8ba0" }}>{s.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
