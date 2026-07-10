"use client";

import { useGetPrices } from "@/hooks/usePricing";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

// Derive accent color for card from plan color —
// some colors in your DB (e.g. #f8fafc) are backgrounds, not text colors,
// so we fall back to a sensible default for text/icons
function getAccentColor(color: string, isDefault: boolean): string {
    if (isDefault) return "#6b7280";
    if (color === "#f8fafc") return "#6b7280";
    return color;
}

function getCardBg(color: string, isDefault: boolean, isPopular: boolean): string {
    if (isPopular) return "linear-gradient(135deg,#faf7fd,#f3ecfc)";
    if (isDefault) return "#ffffff";
    return "#ffffff";
}

export default function Pricing() {
    const { data: plans, isLoading, isError } = useGetPrices();

    // Sort by planOrder ascending
    const sorted = plans
        ? [...plans].sort((a, b) => a.planOrder - b.planOrder)
        : [];

    // Mark the middle plan as "popular" if there are 3+
    const popularIndex = sorted.length >= 3 ? 1 : -1;

    return (
        <section id="pricing" className="py-24 section-alt" aria-label="NexShop Pricing Plans">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} className="text-center mb-16">
                    <span className="bg-white border border-purple-100 text-xs font-semibold px-4 py-2 rounded-full inline-block mb-4 shadow-sm"
                        style={{ color: "#9b59b6" }}>💎 Transparent Pricing</span>
                    <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, color: "#1a1a2e" }}>
                        Choose Your <span className="text-gradient">Earning Plan</span>
                    </h2>
                    <p className="mt-4 max-w-lg mx-auto" style={{ color: "#6b7280" }}>
                        Start free and upgrade anytime. Every plan includes access to real micro jobs with instant payouts.
                    </p>
                </motion.div>

                {/* Loading */}
                {isLoading && (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-purple-500" size={36} />
                    </div>
                )}

                {/* Error */}
                {isError && (
                    <div className="text-center py-20 text-sm" style={{ color: "#9ca3af" }}>
                        Failed to load plans. Please try again later.
                    </div>
                )}

                {/* Plans grid */}
                {!isLoading && !isError && (
                    <div className={`grid gap-6 items-center ${sorted.length === 3 ? "md:grid-cols-3" : sorted.length === 2 ? "md:grid-cols-2 max-w-3xl mx-auto" : "max-w-sm mx-auto"}`}>
                        {sorted.map((plan, i) => {
                            const isPopular = i === popularIndex;
                            const accentColor = getAccentColor(plan.color, plan.isDefault);
                            const cardBg = getCardBg(plan.color, plan.isDefault, isPopular);
                            const price = parseFloat(plan.price) === 0
                                ? "Free"
                                : `$${parseFloat(plan.price).toLocaleString()}`;
                            const period = plan.isDefault
                                ? "forever"
                                : plan.period > 0
                                    ? `${plan.period} days`
                                    : "lifetime";

                            return (
                                <motion.div key={plan.id}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    className={`rounded-2xl p-7 relative ${isPopular ? "shadow-card-hover" : "shadow-card"}`}
                                    style={{
                                        background: cardBg,
                                        border: isPopular
                                            ? "1.5px solid rgba(155,89,182,0.35)"
                                            : "1px solid rgba(155,89,182,0.1)",
                                        transform: isPopular ? "scale(1.04)" : "scale(1)",
                                    }}>

                                    {/* Popular badge */}
                                    {isPopular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold text-white"
                                            style={{ background: "linear-gradient(135deg,#9b59b6,#8e44ad)" }}>
                                            ⚡ Most Popular
                                        </div>
                                    )}

                                    {/* badgeText (e.g. "Best") */}
                                    {plan.badgeText && (
                                        <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-bold text-white"
                                            style={{ background: accentColor }}>
                                            {plan.badgeText}
                                        </div>
                                    )}

                                    <div className="mb-5">
                                        {/* Icon from DB — rendered as raw SVG */}
                                        <div className="mb-3"
                                            dangerouslySetInnerHTML={{ __html: plan.icon }} />

                                        <h3 className="font-bold text-lg mb-1"
                                            style={{ fontFamily: "'Space Grotesk',sans-serif", color: "#1a1a2e" }}>
                                            {plan.membershipName}
                                        </h3>

                                        <p className="text-sm mb-4" style={{ color: "#6b7280" }}>
                                            {plan.title}
                                        </p>

                                        <div className="flex items-end gap-1">
                                            <span className="text-4xl font-extrabold"
                                                style={{ fontFamily: "'Space Grotesk',sans-serif", color: accentColor }}>
                                                {price}
                                            </span>
                                            <span className="text-sm pb-1.5" style={{ color: "#9ca3af" }}>
                                                /{period}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Offers / features */}
                                    <ul className="space-y-3 mb-6">
                                        <li className="flex items-start gap-2.5 text-sm" style={{ color: "#374151" }}>
                                            <Check size={15} className="mt-0.5 shrink-0" style={{ color: accentColor }} />
                                            Up to {plan.jobsSubmitLimit.toLocaleString()} job submissions
                                        </li>
                                        {plan.offers.map((o: { id: string; offer: { offerTitle: string } }) => (
                                            <li key={o.id} className="flex items-start gap-2.5 text-sm" style={{ color: "#374151" }}>
                                                <Check size={15} className="mt-0.5 shrink-0" style={{ color: accentColor }} />
                                                {o.offer.offerTitle}
                                            </li>
                                        ))}
                                    </ul>

                                    <motion.a
                                        href={plan.isDefault ? "/signup" : `/dashboard/plans/upgrade/${plan.id}`}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className={`w-full block text-center py-3 rounded-xl font-semibold text-sm ${isPopular ? "btn-primary glow-purple" : "btn-outline"}`}>
                                        {plan.isDefault ? "Start Free" : `Get ${plan.membershipName}`}
                                    </motion.a>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}