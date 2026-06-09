"use client";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  { name:"Aisha Rahman",   role:"Student, Bangladesh",        avatar:"AR", color:"#9b59b6", earn:"$320/mo", text:"I earn money between classes doing like and comment tasks. NexShop pays out every week, no delays. Best micro job platform I've tried." },
  { name:"Carlos Mendes",  role:"Freelancer, Brazil",         avatar:"CM", color:"#1abc9c", earn:"$580/mo", text:"Started with share tasks, now I focus on review jobs which pay more. The task volume is massive — I never run out of work to do." },
  { name:"Priya Nair",     role:"Stay-at-home Parent, India", avatar:"PN", color:"#3498db", earn:"$210/mo", text:"Perfect for earning in spare time. Subscription tasks are my favorite — quick to complete and the pay is consistent. Highly recommended." },
  { name:"James Okafor",   role:"College Graduate, Nigeria",  avatar:"JO", color:"#f39c12", earn:"$450/mo", text:"NexShop gave me real income while job hunting. Withdrawal to my bank took under 24 hours. Legit and trustworthy platform." },
  { name:"Sofia Petrova",  role:"Part-time Worker, Ukraine",  avatar:"SP", color:"#e74c3c", earn:"$390/mo", text:"I combine YouTube like tasks with comment jobs every morning. Doubled my earnings in 3 months by following the earner tips." },
  { name:"Rajan Chaudhary",role:"Teacher, Pakistan",          avatar:"RC", color:"#8e44ad", earn:"$260/mo", text:"The task variety is impressive. Share and repost jobs during free periods. Clean interface, fast payments, excellent support." },
];

export default function Testimonials() {
  return (
    <section id="earners" className="py-24 bg-white" aria-label="NexShop Earner Reviews and Testimonials">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} className="text-center mb-16">
          <span className="bg-amber-50 border border-amber-100 text-xs font-semibold px-4 py-2 rounded-full inline-block mb-4"
            style={{ color:"#d97706" }}>⭐ Real Earner Stories</span>
          <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(1.8rem,4vw,2.8rem)", fontWeight:800, color:"#1a1a2e" }}>
            Trusted by <span className="text-gradient">500,000 Earners</span>
          </h2>
          <p className="mt-4 max-w-lg mx-auto" style={{ color:"#6b7280" }}>
            Real people, real earnings. See what our community says about working micro jobs on NexShop.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <motion.article key={r.name}
              initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ duration:0.45, delay:i*0.08 }}
              className="card-hover rounded-2xl p-6 shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background:`${r.color}15`, color:r.color }}>{r.avatar}</div>
                <div>
                  <div className="font-semibold text-sm" style={{ color:"#1a1a2e" }}>{r.name}</div>
                  <div className="text-xs" style={{ color:"#9ca3af" }}>{r.role}</div>
                </div>
                <div className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background:"rgba(26,188,156,0.1)", color:"#059669" }}>{r.earn}</div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_,si) => <Star key={si} size={13} fill="#f59e0b" style={{ color:"#f59e0b" }} />)}
              </div>
              <p className="text-sm leading-relaxed" style={{ color:"#6b7280" }}>{r.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}