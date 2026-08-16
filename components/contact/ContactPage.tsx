"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
    Mail, MessageCircle, Phone, MapPin, Clock,
    Send, CheckCircle, ArrowRight, 
    HelpCircle, Briefcase, Users, Star,
    ChevronRight, ExternalLink,
} from "lucide-react";
import Navbar from "../home/Navbar";
import Footer from "../home/Footer";

/* ─── Brand colors ───────────────────────────────────────── */
const C = {
    purple: "#9b59b6",
    purpleDark: "#8e44ad",
    teal: "#1abc9c",
    blue: "#3498db",
    amber: "#f39c12",
    red: "#e74c3c",
    green: "#27ae60",
    wa: "#25D366",       // WhatsApp green
};

/* ─── Social links ───────────────────────────────────────── */
const WAIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

const socials = [
    {
        name: "WhatsApp",
        handle: "+880 1XXX-XXXXXX",
        desc: "Chat with support instantly",
        color: C.wa,
        bg: "#e9fdf0",
        border: "#25D36630",
        href: "https://wa.me/8801XXXXXXXXX?text=Hi%20NextShop%2C%20I%20need%20help%20with",
        icon: () => (
            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
        ),
        badge: "Fastest Response",
        badgeColor: C.wa,
        response: "~2 min",
    },
    {
        name: "Email",
        handle: "support@nexshop.net",
        desc: "For detailed queries & billing",
        color: C.purple,
        bg: "#f8f2fe",
        border: "#9b59b620",
        href: "mailto:support@nexshop.net",
        icon: () => <Mail size={22} />,
        badge: "Formal",
        badgeColor: C.purple,
        response: "< 24 hrs",
    },
    {
        name: "Facebook",
        handle: "NextShop Official",
        desc: "Follow updates & community",
        color: "#1877F2",
        bg: "#eff5ff",
        border: "#1877F220",
        href: "https://facebook.com/nexshop",
        icon: () => (
            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
        ),
        badge: "Community",
        badgeColor: "#1877F2",
        response: "1–2 days",
    },
    {
        name: "Instagram",
        handle: "@nexshop.net",
        desc: "Behind-the-scenes & tips",
        color: "#E1306C",
        bg: "#fff0f5",
        border: "#E1306C20",
        href: "https://instagram.com/nexshop.net",
        icon: () => (
            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
        ),
        badge: "Visual",
        badgeColor: "#E1306C",
        response: "2–3 days",
    },
    {
        name: "Twitter / X",
        handle: "@nexshop",
        desc: "News, updates & quick help",
        color: "#000000",
        bg: "#f5f5f5",
        border: "#00000018",
        href: "https://twitter.com/nexshop",
        icon: () => (
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.261 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
            </svg>
        ),
        badge: "Public",
        badgeColor: "#000",
        response: "1–2 days",
    },
    {
        name: "YouTube",
        handle: "NextShop Channel",
        desc: "Tutorials, guides & tips",
        color: "#FF0000",
        bg: "#fff5f5",
        border: "#FF000020",
        href: "https://youtube.com/@nexshop",
        icon: () => (
            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
        ),
        badge: "Tutorials",
        badgeColor: "#FF0000",
        response: "N/A",
    },
    {
        name: "TikTok",
        handle: "@nexshop",
        desc: "Short tips & earning hacks",
        color: "#010101",
        bg: "#f5f5f5",
        border: "#01010118",
        href: "https://tiktok.com/@nexshop",
        icon: () => (
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.74a4.85 4.85 0 01-1.01-.05z" />
            </svg>
        ),
        badge: "Trending",
        badgeColor: "#E1306C",
        response: "N/A",
    },
    {
        name: "LinkedIn",
        handle: "NextShop Ltd.",
        desc: "Business & partnership inquiries",
        color: "#0A66C2",
        bg: "#f0f7ff",
        border: "#0A66C220",
        href: "https://linkedin.com/company/nexshop",
        icon: () => (
            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
        badge: "B2B",
        badgeColor: "#0A66C2",
        response: "2–3 days",
    },
];

/* ─── Contact topics ─────────────────────────────────────── */
const topics = [
    { icon: HelpCircle, color: C.purple, label: "General Support", wa: "Hi+NextShop%2C+I+need+general+support+regarding" },
    { icon: Briefcase, color: C.teal, label: "Employer Inquiry", wa: "Hi+NextShop%2C+I%27m+interested+in+posting+tasks+as+an+employer" },
    { icon: Users, color: C.blue, label: "Partnership", wa: "Hi+NextShop%2C+I%27d+like+to+discuss+a+partnership+opportunity" },
    { icon: Star, color: C.amber, label: "Withdrawal Issue", wa: "Hi+NextShop%2C+I+have+an+issue+with+my+withdrawal" },
    { icon: Mail, color: C.red, label: "Account Problem", wa: "Hi+NextShop%2C+I+have+an+account+issue+I+need+help+with" },
    { icon: MessageCircle, color: C.green, label: "Task Dispute", wa: "Hi+NextShop%2C+I+want+to+dispute+a+task+rejection" },
];

/* ─── Contact form ───────────────────────────────────────── */
type FormState = { name: string; email: string; topic: string; message: string };

function ContactForm() {
    const [form, setForm] = useState<FormState>({ name: "", email: "", topic: "", message: "" });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const submit = async () => {
        if (!form.name || !form.email || !form.message) return;
        setLoading(true);
        await new Promise(r => setTimeout(r, 1400));
        setLoading(false);
        setSubmitted(true);
    };

    const inputStyle = {
        width: "100%", background: "#faf7fd",
        border: "1.5px solid rgba(155,89,182,0.18)",
        borderRadius: 12, padding: "12px 16px",
        fontSize: 14, color: "#1a1a2e", outline: "none",
        transition: "border-color 0.2s",
        fontFamily: "inherit",
    };

    if (submitted) {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-12 px-6 rounded-2xl h-full"
                style={{ background: "linear-gradient(135deg,#f8f2fe,#f0fdfb)", border: "1.5px solid rgba(155,89,182,0.2)" }}>
                <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.5 }}>
                    <CheckCircle size={56} style={{ color: C.teal }} className="mb-4" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk',sans-serif", color: "#1a1a2e" }}>
                    Message Sent! 🎉
                </h3>
                <p className="text-sm mb-6" style={{ color: "#6b7280" }}>
                    Thanks, <strong>{form.name}</strong>! We received your message and will reply to <strong>{form.email}</strong> within 24 hours.
                </p>
                <p className="text-xs mb-5" style={{ color: "#9ca3af" }}>Need a faster reply?</p>
                <motion.a
                    href={`https://wa.me/8801XXXXXXXXX?text=Hi+NextShop%2C+I+just+submitted+a+contact+form+regarding+${encodeURIComponent(form.topic || "a general inquiry")}`}
                    target="_blank" rel="noopener noreferrer"
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white"
                    style={{ background: C.wa, boxShadow: `0 4px 20px ${C.wa}40` }}>
                    <WAIcon /> Continue on WhatsApp
                </motion.a>
                <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", topic: "", message: "" }); }}
                    className="mt-4 text-xs hover:underline" style={{ color: "#9ca3af" }}>
                    Send another message
                </button>
            </motion.div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>Full Name *</label>
                    <input name="name" value={form.name} onChange={handle} placeholder="Your full name"
                        style={inputStyle}
                        onFocus={e => (e.target.style.borderColor = C.purple)}
                        onBlur={e => (e.target.style.borderColor = "rgba(155,89,182,0.18)")} />
                </div>
                <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>Email Address *</label>
                    <input name="email" type="email" value={form.email} onChange={handle} placeholder="your@email.com"
                        style={inputStyle}
                        onFocus={e => (e.target.style.borderColor = C.purple)}
                        onBlur={e => (e.target.style.borderColor = "rgba(155,89,182,0.18)")} />
                </div>
            </div>
            <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>Topic</label>
                <select name="topic" value={form.topic} onChange={handle}
                    style={{ ...inputStyle, appearance: "none" }}
                    onFocus={e => (e.target.style.borderColor = C.purple)}
                    onBlur={e => (e.target.style.borderColor = "rgba(155,89,182,0.18)")}>
                    <option value="">Select a topic…</option>
                    {topics.map(t => <option key={t.label} value={t.label}>{t.label}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>Message *</label>
                <textarea name="message" value={form.message} onChange={handle} rows={5}
                    placeholder="Describe your question or issue in detail…"
                    style={{ ...inputStyle, resize: "vertical", minHeight: 120 }}
                    onFocus={e => (e.target.style.borderColor = C.purple)}
                    onBlur={e => (e.target.style.borderColor = "rgba(155,89,182,0.18)")} />
            </div>
            <motion.button onClick={submit} disabled={loading || !form.name || !form.email || !form.message}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all"
                style={{
                    background: (!form.name || !form.email || !form.message)
                        ? "rgba(155,89,182,0.4)"
                        : "linear-gradient(135deg,#9b59b6,#8e44ad)",
                    cursor: (!form.name || !form.email || !form.message) ? "not-allowed" : "pointer",
                    boxShadow: (!form.name || !form.email || !form.message) ? "none" : "0 4px 20px rgba(155,89,182,0.35)",
                }}>
                {loading ? (
                    <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending…</>
                ) : (
                    <><Send size={16} /> Send Message</>
                )}
            </motion.button>
            <p className="text-center text-xs" style={{ color: "#9ca3af" }}>
                Or reach us instantly on{" "}
                <a href="https://wa.me/8801XXXXXXXXX" target="_blank" rel="noopener noreferrer"
                    style={{ color: C.wa, fontWeight: 600 }}>WhatsApp ↗</a>
            </p>
        </div>
    );
}

/* ─── Main page ──────────────────────────────────────────── */
export default function ContactPage() {
    return (
        <>
            <Navbar />
            <main style={{ background: "#faf7fd", minHeight: "100vh" }}>

                {/* ── Hero ── */}
                <section className="pt-32 pb-20 relative overflow-hidden"
                    style={{ background: "linear-gradient(135deg,#f8f2fe 0%,#f0fdfb 100%)", borderBottom: "1px solid rgba(155,89,182,0.1)" }}>
                    {/* Blobs */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full"
                            style={{ background: "radial-gradient(circle,rgba(155,89,182,0.12),transparent 70%)", filter: "blur(60px)" }} />
                        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full"
                            style={{ background: "radial-gradient(circle,rgba(26,188,156,0.1),transparent 70%)", filter: "blur(60px)" }} />
                        {/* decorative envelope watermark */}
                        <div className="absolute right-16 top-1/2 -translate-y-1/2 opacity-[0.04] hidden xl:block">
                            <Mail size={300} style={{ color: C.purple }} />
                        </div>
                    </div>

                    <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
                        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
                            <span className="inline-flex items-center gap-2 bg-white border border-purple-100 rounded-full px-4 py-2 mb-5 text-xs font-semibold shadow-sm"
                                style={{ color: C.purple }}>
                                <MessageCircle size={13} /> {`We're`} here to help
                            </span>
                            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(2rem,5vw,3.2rem)", fontWeight: 800, color: "#1a1a2e", lineHeight: 1.15 }}>
                                Get in Touch with{" "}
                                <span className="text-gradient">NextShop</span>
                            </h1>
                            <p className="mt-4 text-base max-w-xl mx-auto leading-relaxed" style={{ color: "#6b7280" }}>
                                Have a question, issue, or partnership idea? Reach us via WhatsApp for instant replies, or choose any channel below. {`We're`} available 7 days a week.
                            </p>

                            {/* Fastest CTA — WhatsApp */}
                            <motion.a
                                href="https://wa.me/8801XXXXXXXXX?text=Hi%20NextShop%2C%20I%20need%20help%20with"
                                target="_blank" rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                whileHover={{ scale: 1.06, y: -3 }} whileTap={{ scale: 0.97 }}
                                className="inline-flex items-center gap-3 mt-8 px-8 py-4 rounded-2xl font-bold text-white text-base"
                                style={{ background: `linear-gradient(135deg,${C.wa},#128C7E)`, boxShadow: `0 8px 30px ${C.wa}50` }}>
                                <div className="w-7 h-7 flex items-center justify-center" style={{ color: "#fff" }}>
                                    <WAIcon />
                                </div>
                                Chat on WhatsApp Now
                                <ArrowRight size={18} />
                            </motion.a>
                            <p className="mt-3 text-xs" style={{ color: "#9ca3af" }}>
                                Average response time: <span style={{ color: C.wa, fontWeight: 700 }}>~2 minutes</span>
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* ── Quick-topic WhatsApp buttons ── */}
                <section style={{ background: "#fff", borderBottom: "1px solid rgba(155,89,182,0.08)" }}>
                    <div className="max-w-5xl mx-auto px-6 py-10">
                        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} className="text-center mb-7">
                            <h2 className="font-bold text-base" style={{ fontFamily: "'Space Grotesk',sans-serif", color: "#1a1a2e" }}>
                                What do you need help with?
                            </h2>
                            <p className="text-sm mt-1" style={{ color: "#9ca3af" }}>Tap a topic to open WhatsApp with a pre-filled message</p>
                        </motion.div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {topics.map((t, i) => (
                                <motion.a key={t.label}
                                    href={`https://wa.me/8801XXXXXXXXX?text=${t.wa}`}
                                    target="_blank" rel="noopener noreferrer"
                                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                                    whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.97 }}
                                    className="flex items-center gap-3 rounded-xl px-4 py-3.5 font-medium text-sm transition-all cursor-pointer"
                                    style={{ background: `${t.color}08`, border: `1.5px solid ${t.color}20`, color: "#374151" }}>
                                    <t.icon size={18} style={{ color: t.color, flexShrink: 0 }} />
                                    <span>{t.label}</span>
                                    <div className="ml-auto flex items-center gap-1 text-xs" style={{ color: C.wa }}>
                                        <WAIcon />
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Main grid: form + info ── */}
                <section className="py-16">
                    <div className="max-w-5xl mx-auto px-6 grid lg:grid-cols-[1fr_380px] gap-8 items-start">

                        {/* Contact form */}
                        <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }} transition={{ duration: 0.5 }}
                            className="rounded-2xl p-8"
                            style={{ background: "#fff", border: "1px solid rgba(155,89,182,0.12)", boxShadow: "0 4px 32px rgba(155,89,182,0.08)" }}>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ background: `${C.purple}12` }}>
                                    <Send size={20} style={{ color: C.purple }} />
                                </div>
                                <div>
                                    <h2 className="font-bold text-base" style={{ fontFamily: "'Space Grotesk',sans-serif", color: "#1a1a2e" }}>
                                        Send a Message
                                    </h2>
                                    <p className="text-xs" style={{ color: "#9ca3af" }}>{`We'll`} reply within 24 hours</p>
                                </div>
                            </div>
                            <ContactForm />
                        </motion.div>

                        {/* Right sidebar: info + WhatsApp + social */}
                        <div className="space-y-5">

                            {/* WhatsApp card — hero */}
                            <motion.a href="https://wa.me/8801XXXXXXXXX?text=Hi%20NextShop%2C%20I%20need%20help%20with"
                                target="_blank" rel="noopener noreferrer"
                                initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }} transition={{ duration: 0.5 }}
                                whileHover={{ scale: 1.02, y: -4 }}
                                className="block rounded-2xl p-5 cursor-pointer"
                                style={{ background: `linear-gradient(135deg,#e9fdf0,#d4f8e8)`, border: `1.5px solid ${C.wa}35`, boxShadow: `0 6px 28px ${C.wa}20` }}>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                                        style={{ background: C.wa }}>
                                        <div style={{ color: "#fff" }}><WAIcon /></div>
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm" style={{ fontFamily: "'Space Grotesk',sans-serif", color: "#064E3B" }}>WhatsApp Support</div>
                                        <div className="text-xs" style={{ color: "#059669" }}>Online now · ~2 min response</div>
                                    </div>
                                    <div className="ml-auto">
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-400" style={{ animation: "pulse-ring 1.5s ease-out infinite" }} />
                                    </div>
                                </div>
                                <p className="text-xs leading-relaxed mb-3" style={{ color: "#065F46" }}>
                                    Get instant support from our team. Chat opens with a pre-filled message so you can explain your issue right away.
                                </p>
                                <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: C.wa }}>
                                    Start WhatsApp Chat <ChevronRight size={14} />
                                </div>
                            </motion.a>

                            {/* Office info */}
                            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
                                className="rounded-2xl p-5 space-y-4"
                                style={{ background: "#fff", border: "1px solid rgba(155,89,182,0.1)", boxShadow: "0 2px 16px rgba(155,89,182,0.06)" }}>
                                <h3 className="font-bold text-sm" style={{ fontFamily: "'Space Grotesk',sans-serif", color: "#1a1a2e" }}>Contact Details</h3>
                                {[
                                    { icon: Mail, color: C.purple, label: "Email", value: "support@nexshop.net", href: "mailto:support@nexshop.net" },
                                    { icon: Phone, color: C.teal, label: "WhatsApp", value: "+880 1XXX-XXXXXX", href: "https://wa.me/8801XXXXXXXXX" },
                                    { icon: MapPin, color: C.red, label: "Address", value: "Dhaka, Bangladesh", href: null },
                                    { icon: Clock, color: C.amber, label: "Hours", value: "Mon–Fri: 9AM–9PM (BST)", href: null },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                            style={{ background: `${item.color}12` }}>
                                            <item.icon size={15} style={{ color: item.color }} />
                                        </div>
                                        <div>
                                            <div className="text-xs font-semibold mb-0.5" style={{ color: "#9ca3af" }}>{item.label}</div>
                                            {item.href ? (
                                                <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined}
                                                    rel="noopener noreferrer"
                                                    className="text-sm font-medium hover:underline" style={{ color: item.color }}>
                                                    {item.value}
                                                </a>
                                            ) : (
                                                <div className="text-sm font-medium" style={{ color: "#374151" }}>{item.value}</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>

                            {/* Response time table */}
                            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }}
                                className="rounded-2xl p-5"
                                style={{ background: "#fff", border: "1px solid rgba(155,89,182,0.1)", boxShadow: "0 2px 16px rgba(155,89,182,0.06)" }}>
                                <h3 className="font-bold text-sm mb-4" style={{ fontFamily: "'Space Grotesk',sans-serif", color: "#1a1a2e" }}>
                                    Response Times
                                </h3>
                                {[
                                    { channel: "WhatsApp", time: "~2 min", color: C.wa },
                                    { channel: "Email", time: "< 24 hrs", color: C.purple },
                                    { channel: "Facebook", time: "1–2 days", color: "#1877F2" },
                                    { channel: "Twitter/X", time: "1–2 days", color: "#000" },
                                    { channel: "LinkedIn", time: "2–3 days", color: "#0A66C2" },
                                ].map((r) => (
                                    <div key={r.channel} className="flex items-center justify-between py-2"
                                        style={{ borderBottom: "1px solid rgba(155,89,182,0.06)" }}>
                                        <span className="text-xs font-medium" style={{ color: "#374151" }}>{r.channel}</span>
                                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                                            style={{ background: `${r.color}12`, color: r.color }}>{r.time}</span>
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* ── Social links full section ── */}
                <section style={{ background: "#fff", borderTop: "1px solid rgba(155,89,182,0.08)" }}>
                    <div className="max-w-5xl mx-auto px-6 py-14">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} className="text-center mb-10">
                            <span className="inline-flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-full px-4 py-2 mb-4 text-xs font-semibold"
                                style={{ color: C.purple }}>
                                🌐 Find Us Everywhere
                            </span>
                            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 800, color: "#1a1a2e" }}>
                                Connect on <span className="text-gradient">Social Media</span>
                            </h2>
                            <p className="mt-3 text-sm max-w-md mx-auto" style={{ color: "#6b7280" }}>
                                Follow NextShop for the latest task announcements, earning tips, and platform updates.
                            </p>
                        </motion.div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {socials.map((s, i) => (
                                <motion.a key={s.name}
                                    href={s.href} target="_blank" rel="noopener noreferrer"
                                    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}
                                    whileHover={{ scale: 1.04, y: -6 }} whileTap={{ scale: 0.97 }}
                                    className="group rounded-2xl p-5 flex flex-col gap-3 cursor-pointer transition-all"
                                    style={{ background: s.bg, border: `1.5px solid ${s.border}`, boxShadow: `0 2px 12px ${s.color}0d` }}>
                                    <div className="flex items-start justify-between">
                                        <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                                            style={{ background: `${s.color}18`, color: s.color }}>
                                            <s.icon />
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            {s.response !== "N/A" && (
                                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                                                    style={{ background: `${s.badgeColor}15`, color: s.badgeColor }}>
                                                    {s.badge}
                                                </span>
                                            )}
                                            <ExternalLink size={13} style={{ color: "#9ca3af" }}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm mb-0.5" style={{ fontFamily: "'Space Grotesk',sans-serif", color: "#1a1a2e" }}>
                                            {s.name}
                                        </div>
                                        <div className="text-xs font-medium mb-1" style={{ color: s.color }}>{s.handle}</div>
                                        <div className="text-xs leading-relaxed" style={{ color: "#6b7280" }}>{s.desc}</div>
                                    </div>
                                    {s.response !== "N/A" && (
                                        <div className="flex items-center gap-1.5 pt-1" style={{ borderTop: `1px solid ${s.color}15` }}>
                                            <Clock size={11} style={{ color: "#9ca3af" }} />
                                            <span className="text-xs" style={{ color: "#9ca3af" }}>Response: <strong style={{ color: s.color }}>{s.response}</strong></span>
                                        </div>
                                    )}
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Bottom WhatsApp CTA ── */}
                <section style={{ background: "linear-gradient(135deg,#f8f2fe,#f0fdfb)", borderTop: "1px solid rgba(155,89,182,0.1)" }}>
                    <div className="max-w-3xl mx-auto px-6 py-14 text-center">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}>
                            <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                                style={{ background: C.wa, boxShadow: `0 8px 30px ${C.wa}40` }}>
                                <div style={{ color: "#fff", transform: "scale(1.2)" }}><WAIcon /></div>
                            </div>
                            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 800, color: "#1a1a2e" }}>
                                Still have questions?<br />
                                <span style={{ color: C.wa }}>{`We're`} on WhatsApp 24/7</span>
                            </h2>
                            <p className="mt-3 text-sm max-w-md mx-auto" style={{ color: "#6b7280" }}>
                                Our support team is available around the clock on WhatsApp. Get instant answers to your questions about tasks, payouts, or your account.
                            </p>
                            <motion.a
                                href="https://wa.me/8801XXXXXXXXX?text=Hi%20NextShop%2C%20I%20have%20a%20question%20about"
                                target="_blank" rel="noopener noreferrer"
                                whileHover={{ scale: 1.06, y: -3 }} whileTap={{ scale: 0.97 }}
                                className="inline-flex items-center gap-3 mt-7 px-8 py-4 rounded-2xl font-bold text-white text-base"
                                style={{ background: `linear-gradient(135deg,${C.wa},#128C7E)`, boxShadow: `0 8px 30px ${C.wa}45` }}>
                                <div style={{ color: "#fff" }}><WAIcon /></div>
                                Open WhatsApp Chat
                                <ArrowRight size={18} />
                            </motion.a>
                            <p className="mt-3 text-xs" style={{ color: "#9ca3af" }}>
                                No app download needed on desktop · Opens in WhatsApp Web
                            </p>
                        </motion.div>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
}