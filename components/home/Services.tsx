"use client";
import { motion } from "framer-motion";
import { ThumbsUp, MessageCircle, Share2, Bell, Star, Heart, UserPlus, Eye, Bookmark } from "lucide-react";

const services = [
  { icon: ThumbsUp,      title: "Like Tasks",         desc: "Get paid to like posts and videos across YouTube, Instagram, TikTok, Facebook, and Twitter/X.",                                   color: "#9b59b6", badge: "Most Popular", earn: "$0.05–$0.50/task",  tags: ["YouTube","Instagram"] },
  { icon: MessageCircle, title: "Comment Jobs",       desc: "Write genuine comments on social media posts, blogs, and videos. Earn more per quality comment.",                               color: "#1abc9c", badge: "High Pay",    earn: "$0.20–$2.00/task",  tags: ["Facebook","YouTube"] },
  { icon: Share2,        title: "Share & Repost",     desc: "Share content on your profiles and earn. Simple reshares or reposts count toward daily earnings.",                             color: "#3498db", badge: "Easy",        earn: "$0.05–$0.30/task",  tags: ["Twitter/X","LinkedIn"] },
  { icon: Bell,          title: "Subscribe & Follow", desc: "Subscribe to YouTube channels, follow on Instagram, TikTok, and Twitch for instant pay.",                                      color: "#f39c12", badge: "Quick",       earn: "$0.10–$0.80/task",  tags: ["YouTube","TikTok"] },
  { icon: Star,          title: "Review & Rate",      desc: "Leave honest reviews on app stores, Google Business, and e-commerce sites. Top-paid category.",                               color: "#e74c3c", badge: "Top Earner",  earn: "$0.50–$5.00/task",  tags: ["Google","App Store"] },
  { icon: UserPlus,      title: "Referral Tasks",     desc: "Refer new users to platforms and apps. Earn generous commissions for every successful sign-up.",                              color: "#8e44ad", badge: "Passive",     earn: "$1.00–$10.00/ref",  tags: ["Apps","Platforms"] },
  { icon: Eye,           title: "Watch & View",       desc: "Watch short videos and ads to completion. Earn per view with no skills or experience needed.",                                 color: "#1abc9c", badge: "Beginner",    earn: "$0.01–$0.15/view",  tags: ["YouTube Ads","Reels"] },
  { icon: Heart,         title: "React & Engage",     desc: "Use emoji reactions and upvotes across Reddit, LinkedIn, and other content platforms.",                                        color: "#e91e8c", badge: "New",         earn: "$0.03–$0.25/task",  tags: ["Reddit","LinkedIn"] },
  { icon: Bookmark,      title: "Save & Bookmark",    desc: "Bookmark posts and save content across Pinterest, YouTube, and social media for quick pay.",                                   color: "#9b59b6", badge: "Easy",        earn: "$0.05–$0.20/task",  tags: ["Pinterest","Instagram"] },
];

const badgeColors: Record<string,string> = {
  "Most Popular":"#9b59b6","High Pay":"#1abc9c","Top Earner":"#e74c3c",
  "Passive":"#8e44ad","New":"#e91e8c","Easy":"#3498db","Quick":"#f39c12","Beginner":"#27ae60",
};

export default function Services() {
  return (
    <section id="services" className="py-24 section-alt" aria-label="Micro Job Services on NexShop">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          transition={{ duration:0.6 }} className="text-center mb-16">
          <span className="bg-white text-xs font-semibold px-4 py-2 rounded-full inline-block mb-4 shadow-sm"
            style={{ color:"#1abc9c", border:"1px solid rgba(26,188,156,0.2)" }}>
            💼 Browse All Micro Job Categories
          </span>
          <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(1.8rem,4vw,2.8rem)", fontWeight:800, color:"#1a1a2e" }}>
            Every Type of Social <span className="text-gradient">Micro Job</span>
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-base" style={{ color:"#6b7280" }}>
            Choose from dozens of task categories. Complete jobs on your schedule, cash out anytime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <motion.article key={s.title}
              initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ duration:0.45, delay:i*0.07 }}
              className="card-hover rounded-2xl p-6 cursor-pointer shadow-card">
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background:`${s.color}12` }}>
                  <s.icon size={22} style={{ color:s.color }} />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background:`${badgeColors[s.badge]??s.color}12`, color:badgeColors[s.badge]??s.color }}>
                  {s.badge}
                </span>
              </div>
              <h3 className="font-bold text-base mb-2"
                style={{ fontFamily:"'Space Grotesk',sans-serif", color:"#1a1a2e" }}>{s.title}</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color:"#6b7280" }}>{s.desc}</p>
              <div className="flex items-center justify-between pt-4"
                style={{ borderTop:"1px solid rgba(155,89,182,0.08)" }}>
                <span className="text-sm font-bold text-gradient">{s.earn}</span>
                <div className="flex gap-1.5">
                  {s.tags.map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background:"rgba(155,89,182,0.07)", color:"#8b8ba0" }}>{t}</span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
          transition={{ delay:0.5 }} className="text-center mt-12">
          <motion.a href="#" whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
            className="btn-primary px-8 py-3.5 rounded-xl font-semibold inline-flex items-center gap-2 glow-purple">
            Browse All 50+ Task Categories →
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}