"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Shield, Users, DollarSign, AlertTriangle, Lock,
  Globe, RefreshCw, Mail, ChevronDown, ChevronUp, ArrowUp,
  CheckCircle, Scale, Eye, Ban, CreditCard
} from "lucide-react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

/* ─── Section data ─────────────────────────────────────── */
const sections = [
  {
    id: "acceptance",
    icon: CheckCircle,
    color: "#9b59b6",
    title: "1. Acceptance of Terms",
    content: [
      {
        heading: "Agreement to Terms",
        body: "By accessing or using Nexshop ('Platform', 'Service', 'we', 'us', or 'our'), you ('User', 'Earner', 'you') agree to be bound by these Terms and Conditions ('Terms'). These Terms constitute a legally binding agreement between you and Nexshop Ltd. If you do not agree with any part of these Terms, you must not use our Platform.",
      },
      {
        heading: "Eligibility",
        body: "You must be at least 18 years of age (or the age of majority in your jurisdiction) to create an account and use Nexshop. By agreeing to these Terms, you represent and warrant that you meet this eligibility requirement. Accounts created by individuals under the minimum age will be terminated without notice.",
      },
      {
        heading: "Modifications",
        body: "Nexshop reserves the right to update or modify these Terms at any time. We will notify registered users of material changes via email or prominent in-platform notice at least 14 days before such changes take effect. Your continued use of the Platform after the effective date constitutes acceptance of the revised Terms.",
      },
    ],
  },
  {
    id: "account",
    icon: Users,
    color: "#1abc9c",
    title: "2. Account Registration & Security",
    content: [
      {
        heading: "Account Creation",
        body: "To access the full features of Nexshop, you must register for an account by providing accurate, complete, and current information including your full name, email address, and payment details. You agree to update this information promptly if it changes.",
      },
      {
        heading: "Account Security",
        body: "You are solely responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You agree to notify Nexshop immediately at support@Nexshop.com if you suspect any unauthorized access to your account. Nexshop will not be liable for any losses arising from unauthorized account access due to your failure to safeguard your credentials.",
      },
      {
        heading: "One Account Per User",
        body: "Each user is permitted to maintain only one (1) active account on Nexshop. Creating multiple accounts for the purpose of circumventing restrictions, earning duplicate bonuses, or any other fraudulent purpose is strictly prohibited and will result in permanent termination of all associated accounts and forfeiture of any pending earnings.",
      },
      {
        heading: "Account Verification",
        body: "Nexshop may require identity verification at any point, including but not limited to email verification, phone number verification, or submission of government-issued identification documents. Failure to complete verification when requested may result in temporary suspension of withdrawal privileges.",
      },
    ],
  },
  {
    id: "services",
    icon: FileText,
    color: "#3498db",
    title: "3. Platform Services & Micro Jobs",
    content: [
      {
        heading: "Description of Services",
        body: "Nexshop is a micro-task marketplace connecting Earners with Employers. Earners complete social media tasks including but not limited to: liking posts, leaving comments, sharing content, subscribing to channels, following accounts, watching videos, writing reviews, and other engagement-based activities across third-party social media platforms.",
      },
      {
        heading: "Task Completion Standards",
        body: "All tasks must be completed genuinely and in accordance with the specific instructions provided for each task. Earners agree to: (a) complete tasks using authentic, active social media accounts; (b) maintain task submissions for the duration specified by the Employer; (c) submit accurate proof screenshots or verification as required; and (d) not use bots, scripts, automation tools, or any artificial means to complete tasks.",
      },
      {
        heading: "Task Availability",
        body: "Nexshop does not guarantee a minimum number of available tasks at any given time. Task availability varies based on Employer demand, geographic location, platform plan, and other factors. Nexshop reserves the right to modify, suspend, or discontinue any task category without prior notice.",
      },
      {
        heading: "Third-Party Platform Compliance",
        body: "Earners are solely responsible for ensuring their activities on third-party social media platforms (YouTube, Instagram, TikTok, Facebook, Twitter/X, etc.) comply with those platforms' respective Terms of Service. Nexshop is not affiliated with any third-party social media platform and accepts no liability for account actions taken by third-party platforms against Earners.",
      },
    ],
  },
  {
    id: "earnings",
    icon: DollarSign,
    color: "#f39c12",
    title: "4. Earnings, Payments & Withdrawals",
    content: [
      {
        heading: "Earning Structure",
        body: "Compensation for completed tasks is determined by the Employer and displayed prior to task acceptance. Pay rates vary by task type, platform, quality requirements, and complexity. Displayed rates are in United States Dollars (USD) unless otherwise specified. Nexshop deducts a service fee of up to 15% from Employer payments before distributing Earner compensation.",
      },
      {
        heading: "Payment Verification",
        body: "Earnings are credited to your Nexshop Wallet only after successful task verification. Verification typically occurs within 24–72 hours of task submission. Nexshop reserves the right to reject or dispute task submissions that do not meet quality standards or appear fraudulent. Disputed earnings may be withheld pending investigation.",
      },
      {
        heading: "Withdrawal Terms",
        body: "Free plan users may withdraw a minimum of $10.00 per transaction. Pro plan users may withdraw a minimum of $5.00. Agency plan users have no withdrawal minimum. Withdrawals are processed within 1–5 business days depending on the selected payment method. Available withdrawal methods include PayPal, bank transfer (SWIFT/SEPA), and cryptocurrency (USDT/BTC/ETH).",
      },
      {
        heading: "Taxes & Withholding",
        body: "Earners are solely responsible for reporting and paying all applicable taxes on earnings received through Nexshop. Nexshop may be required to withhold taxes and file tax reports in certain jurisdictions. Users in the United States earning over $600 in a calendar year will be issued a Form 1099-NEC. Nexshop recommends consulting a tax professional regarding your obligations.",
      },
      {
        heading: "Frozen & Forfeited Earnings",
        body: "Earnings may be frozen pending investigation in cases of suspected fraud, policy violations, or chargebacks. Accounts terminated due to Terms violations forfeit all pending and wallet earnings. Accounts inactive for 12 consecutive months may have balances below $5.00 automatically forfeited.",
      },
    ],
  },
  {
    id: "prohibited",
    icon: Ban,
    color: "#e74c3c",
    title: "5. Prohibited Activities",
    content: [
      {
        heading: "Fraudulent Task Completion",
        body: "The following activities are strictly prohibited and will result in immediate account termination and forfeiture of all earnings: using bots, macros, scripts, or automated tools; submitting fabricated proof screenshots; completing tasks using fake, purchased, or inactive social media accounts; coordinating with other users to artificially inflate task metrics; or any other deceptive practice intended to fraudulently earn compensation.",
      },
      {
        heading: "Platform Abuse",
        body: "Users may not: attempt to reverse-engineer, decompile, or exploit the Nexshop platform; launch denial-of-service attacks or other cyberattacks; scrape or harvest user data; post spam, malware, or malicious links; impersonate Nexshop staff or other users; or access the platform using unauthorized automated means.",
      },
      {
        heading: "Harmful & Illegal Content",
        body: "Users must not submit, share, or engage with content that is illegal, defamatory, obscene, hateful, discriminatory, or otherwise harmful. This includes but is not limited to child sexual abuse material (CSAM), content promoting violence or terrorism, or content that infringes on third-party intellectual property rights. Nexshop will report illegal content to relevant authorities.",
      },
      {
        heading: "Multi-Account & Referral Fraud",
        body: "Creating multiple accounts, using false referral information, self-referrals, or engaging in coordinated referral schemes to fraudulently earn bonuses is prohibited. Nexshop employs sophisticated fraud detection and will terminate all involved accounts and reverse fraudulent earnings upon detection.",
      },
    ],
  },
  {
    id: "intellectual",
    icon: Eye,
    color: "#8e44ad",
    title: "6. Intellectual Property",
    content: [
      {
        heading: "Nexshop Ownership",
        body: "All content, features, design elements, trademarks, service marks, logos, and technology comprising the Nexshop Platform are owned by Nexshop Ltd. or its licensors and are protected by applicable intellectual property laws. You are granted a limited, non-exclusive, non-transferable, revocable license to use the Platform solely for its intended purpose.",
      },
      {
        heading: "User Content",
        body: "By submitting content to Nexshop (including proof screenshots, profile information, and communications), you grant Nexshop a worldwide, royalty-free, non-exclusive license to use, display, reproduce, and distribute such content solely for the purpose of operating and improving the Platform. You represent that you have all necessary rights to grant this license.",
      },
      {
        heading: "Feedback",
        body: "Any feedback, suggestions, or ideas you provide regarding Nexshop may be used by us without any obligation to compensate you, and you irrevocably assign all rights in such feedback to Nexshop.",
      },
    ],
  },
  {
    id: "privacy",
    icon: Lock,
    color: "#1abc9c",
    title: "7. Privacy & Data Protection",
    content: [
      {
        heading: "Data Collection",
        body: "Nexshop collects personal information necessary to operate the Platform including name, email address, payment information, IP address, device information, and usage data. Our collection and use of personal data is governed by our Privacy Policy, which is incorporated into these Terms by reference.",
      },
      {
        heading: "GDPR & International Users",
        body: "For users in the European Economic Area (EEA) and United Kingdom, Nexshop processes personal data in accordance with the General Data Protection Regulation (GDPR). You have the right to access, correct, delete, and port your personal data. Submit data requests to privacy@Nexshop.com. We will respond within 30 days.",
      },
      {
        heading: "Data Security",
        body: "Nexshop implements industry-standard security measures including SSL/TLS encryption, secure data storage, and access controls. However, no method of transmission over the internet is 100% secure. You acknowledge that you provide personal information at your own risk and that Nexshop cannot guarantee absolute security.",
      },
      {
        heading: "Third-Party Data Sharing",
        body: "Nexshop does not sell your personal data to third parties. We may share data with trusted service providers necessary to operate the Platform (payment processors, cloud hosting, analytics) under strict confidentiality agreements. We may disclose data when required by law or to protect the rights and safety of users.",
      },
    ],
  },
  {
    id: "liability",
    icon: Scale,
    color: "#9b59b6",
    title: "8. Limitation of Liability & Disclaimers",
    content: [
      {
        heading: "Disclaimer of Warranties",
        body: 'Nexshop is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. Nexshop does not warrant that the Platform will be uninterrupted, error-free, or free of viruses or harmful components.',
      },
      {
        heading: "Limitation of Liability",
        body: "To the maximum extent permitted by applicable law, Nexshop and its directors, officers, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of earnings, loss of data, or loss of goodwill, arising out of or in connection with your use of the Platform, even if advised of the possibility of such damages.",
      },
      {
        heading: "Cap on Liability",
        body: "Nexshop's total cumulative liability to you for any claims arising under these Terms shall not exceed the greater of: (a) the total amount paid by you to Nexshop in the three (3) months preceding the event giving rise to the claim, or (b) USD $50.00.",
      },
      {
        heading: "Indemnification",
        body: "You agree to indemnify, defend, and hold harmless Nexshop and its affiliates from any claims, damages, losses, liabilities, costs, and expenses (including reasonable legal fees) arising from: (a) your use of the Platform; (b) your violation of these Terms; (c) your violation of any third-party rights; or (d) any content you submit through the Platform.",
      },
    ],
  },
  {
    id: "termination",
    icon: AlertTriangle,
    color: "#e74c3c",
    title: "9. Account Termination & Suspension",
    content: [
      {
        heading: "Termination by Nexshop",
        body: "Nexshop reserves the right to suspend or terminate your account at any time, with or without notice, for any reason, including but not limited to: violation of these Terms; fraudulent or abusive behavior; extended inactivity (12+ months); or at Nexshop's sole discretion for the protection of the Platform and its users.",
      },
      {
        heading: "Termination by User",
        body: "You may terminate your account at any time by submitting a written request to support@Nexshop.com or through the account settings page. Upon termination, you remain responsible for any outstanding obligations. Termination does not affect any rights or obligations that accrued prior to the termination date.",
      },
      {
        heading: "Effect of Termination",
        body: "Upon account termination: your access to the Platform will be immediately revoked; pending tasks will be cancelled; your Wallet balance may be forfeited if termination is due to Terms violations; legitimate balances above the withdrawal minimum may be paid out within 30 days at Nexshop's discretion.",
      },
    ],
  },
  {
    id: "governing",
    icon: Globe,
    color: "#3498db",
    title: "10. Governing Law & Dispute Resolution",
    content: [
      {
        heading: "Governing Law",
        body: "These Terms shall be governed by and construed in accordance with the laws of England and Wales, without regard to its conflict of law provisions. However, if you are a consumer located in the European Union, you may also benefit from mandatory provisions of the law of your country of residence.",
      },
      {
        heading: "Informal Resolution",
        body: "Before initiating formal legal proceedings, you agree to first attempt to resolve disputes informally by contacting Nexshop at legal@Nexshop.com. Nexshop will attempt to respond within 30 days and work in good faith toward resolution.",
      },
      {
        heading: "Arbitration",
        body: "If informal resolution fails, any dispute, controversy, or claim arising out of or in connection with these Terms shall be submitted to binding arbitration under the rules of the London Court of International Arbitration (LCIA). The arbitration shall be conducted in English. The arbitrator's decision shall be final and binding.",
      },
      {
        heading: "Class Action Waiver",
        body: "To the maximum extent permitted by law, you waive any right to bring claims as a plaintiff or class member in any class action, class arbitration, or representative proceeding. All disputes must be brought on an individual basis.",
      },
    ],
  },
  {
    id: "contact",
    icon: Mail,
    color: "#1abc9c",
    title: "11. Contact Information",
    content: [
      {
        heading: "General Support",
        body: "For general questions about your account, tasks, or earnings, contact our support team at support@Nexshop.com or through the in-platform Help Center. Our support team is available Monday–Friday, 9:00 AM – 6:00 PM (UTC).",
      },
      {
        heading: "Legal & Privacy",
        body: "For legal inquiries, Terms questions, GDPR data requests, or intellectual property matters, contact our legal team at legal@Nexshop.com or privacy@Nexshop.com respectively. Nexshop Ltd., 20 Fenchurch Street, London, EC3M 3BY, United Kingdom.",
      },
    ],
  },
];

/* ─── Table of Contents ─────────────────────────────────── */
function TableOfContents({
  active, onClick,
}: { active: string; onClick: (id: string) => void }) {
  return (
    <div className="sticky top-28 rounded-2xl overflow-hidden"
      style={{ background: "#fff", border: "1px solid rgba(155,89,182,0.12)", boxShadow: "0 4px 24px rgba(155,89,182,0.08)" }}>
      <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(155,89,182,0.1)", background: "linear-gradient(135deg,#f8f2fe,#f0fdfb)" }}>
        <div className="flex items-center gap-2">
          <FileText size={16} style={{ color: "#9b59b6" }} />
          <span className="text-sm font-bold" style={{ fontFamily: "'Space Grotesk',sans-serif", color: "#1a1a2e" }}>
            Table of Contents
          </span>
        </div>
      </div>
      <nav className="p-3">
        {sections.map((s) => (
          <button key={s.id} onClick={() => onClick(s.id)}
            className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200"
            style={{
              background: active === s.id ? `${s.color}10` : "transparent",
              color: active === s.id ? s.color : "#6b7280",
              borderLeft: active === s.id ? `3px solid ${s.color}` : "3px solid transparent",
            }}>
            <s.icon size={13} style={{ flexShrink: 0 }} />
            <span className="leading-snug">{s.title}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

/* ─── Section Card ──────────────────────────────────────── */
function SectionCard({ section }: { section: typeof sections[0] }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <motion.div id={section.id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="rounded-2xl overflow-hidden"
      style={{ background: "#fff", border: "1px solid rgba(155,89,182,0.1)", boxShadow: "0 2px 16px rgba(155,89,182,0.06)" }}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-6 py-5 text-left transition-colors hover:bg-purple-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${section.color}12` }}>
            <section.icon size={20} style={{ color: section.color }} />
          </div>
          <h2 className="font-bold text-base" style={{ fontFamily: "'Space Grotesk',sans-serif", color: "#1a1a2e" }}>
            {section.title}
          </h2>
        </div>
        {expanded
          ? <ChevronUp size={18} style={{ color: section.color, flexShrink: 0 }} />
          : <ChevronDown size={18} style={{ color: "#9ca3af", flexShrink: 0 }} />}
      </button>

      {/* Body */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}>
            <div className="px-6 pb-6" style={{ borderTop: "1px solid rgba(155,89,182,0.07)" }}>
              {section.content.map((c, i) => (
                <div key={i} className={i === 0 ? "pt-5" : "pt-5 border-t border-purple-50"} style={{ marginTop: i === 0 ? 0 : 16 }}>
                  <h3 className="font-semibold text-sm mb-2"
                    style={{ color: section.color, fontFamily: "'Space Grotesk',sans-serif" }}>
                    {c.heading}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#6b7280" }}>{c.body}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Main Page ─────────────────────────────────────────── */
export default function TermsPage() {
  const [activeSection, setActiveSection] = useState("acceptance");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 600);
      const sectionEls = sections.map(s => document.getElementById(s.id));
      for (let i = sectionEls.length - 1; i >= 0; i--) {
        const el = sectionEls[i];
        if (el && el.getBoundingClientRect().top <= 160) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Navbar />
      <main style={{ background: "#faf7fd", minHeight: "100vh" }}>

        {/* ── Hero banner ── */}
        <section className="pt-32 pb-16 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg,#f8f2fe 0%,#f0fdfb 100%)", borderBottom: "1px solid rgba(155,89,182,0.1)" }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-72 h-72 rounded-full"
              style={{ background: "radial-gradient(circle,rgba(155,89,182,0.1),transparent 70%)", filter: "blur(40px)" }} />
            <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full"
              style={{ background: "radial-gradient(circle,rgba(26,188,156,0.08),transparent 70%)", filter: "blur(40px)" }} />
          </div>
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 bg-white border border-purple-100 rounded-full px-4 py-2 mb-5 text-xs font-semibold shadow-sm"
                style={{ color: "#9b59b6" }}>
                <Scale size={13} />
                Legal Document
              </div>
              <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, color: "#1a1a2e", lineHeight: 1.15 }}>
                Terms &amp; <span className="text-gradient">Conditions</span>
              </h1>
              <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: "#6b7280" }}>
                These Terms govern your use of the Nexshop micro jobs platform. Please read them carefully before creating an account or completing tasks.
              </p>
              {/* Meta pills */}
              <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                {[
                  { icon: RefreshCw, label: "Last Updated: January 15, 2025" },
                  { icon: Globe,     label: "Effective: February 1, 2025" },
                  { icon: Shield,    label: "Version 3.2" },
                ].map(({ icon: Icon, label }) => (
                  <span key={label} className="flex items-center gap-1.5 bg-white border border-purple-100 rounded-full px-3 py-1.5 text-xs shadow-sm"
                    style={{ color: "#6b7280" }}>
                    <Icon size={12} style={{ color: "#9b59b6" }} />{label}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Summary cards ── */}
        <section className="py-10" style={{ background: "#fff", borderBottom: "1px solid rgba(155,89,182,0.08)" }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Users,      color: "#9b59b6", title: "Who It Applies To", desc: "All registered users, earners, and employers on the Nexshop platform." },
                { icon: DollarSign, color: "#1abc9c", title: "Earnings & Payouts", desc: "Task pay rates, withdrawal limits, tax obligations, and payment timelines." },
                { icon: Ban,        color: "#e74c3c", title: "Prohibited Activities", desc: "Bots, fraud, fake accounts, multi-account abuse, and harmful content are banned." },
                { icon: CreditCard, color: "#f39c12", title: "Refund Policy", desc: "Employer deposits are non-refundable once distributed to Earner wallets." },
              ].map((c) => (
                <div key={c.title} className="rounded-xl p-4"
                  style={{ background: `${c.color}06`, border: `1px solid ${c.color}18` }}>
                  <c.icon size={20} className="mb-2" style={{ color: c.color }} />
                  <div className="font-semibold text-sm mb-1" style={{ color: "#1a1a2e", fontFamily: "'Space Grotesk',sans-serif" }}>{c.title}</div>
                  <p className="text-xs leading-relaxed" style={{ color: "#6b7280" }}>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Main content ── */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">

            {/* Sidebar ToC */}
            <aside className="hidden lg:block">
              <TableOfContents active={activeSection} onClick={scrollToSection} />
            </aside>

            {/* Sections */}
            <div className="space-y-4">
              {sections.map((s) => <SectionCard key={s.id} section={s} />)}

              {/* Acceptance banner */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl p-6 text-center"
                style={{ background: "linear-gradient(135deg,rgba(155,89,182,0.08),rgba(26,188,156,0.06))", border: "1.5px solid rgba(155,89,182,0.2)" }}>
                <CheckCircle size={28} className="mx-auto mb-3" style={{ color: "#9b59b6" }} />
                <h3 className="font-bold text-base mb-2" style={{ fontFamily: "'Space Grotesk',sans-serif", color: "#1a1a2e" }}>
                  By Using Nexshop, You Accept These Terms
                </h3>
                <p className="text-sm" style={{ color: "#6b7280" }}>
                  Your continued use of the Platform constitutes your full acceptance of these Terms and Conditions, our Privacy Policy, and any applicable guidelines. If you have questions, contact us at <a href="mailto:legal@Nexshop.com" style={{ color: "#9b59b6" }}>legal@Nexshop.com</a>.
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll-to-top */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="fixed bottom-8 right-8 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg z-50"
              style={{ background: "linear-gradient(135deg,#9b59b6,#8e44ad)" }}>
              <ArrowUp size={20} />
            </motion.button>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}