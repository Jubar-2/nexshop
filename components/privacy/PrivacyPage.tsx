"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Lock, Eye, Database, Share2, UserCheck,
  Cookie, Globe, Mail, RefreshCw, ChevronDown,
  ChevronUp, ArrowUp, AlertTriangle,
  Fingerprint, Server, Trash2, Download, Settings,
  FileText, Users, Key, ToggleLeft,
} from "lucide-react";
import Navbar from "../home/Navbar";
import Footer from "../home/Footer";

/* ─── Color palette ──────────────────────────────────────── */
const C = {
  purple: "#9b59b6",
  purpleDark: "#8e44ad",
  teal: "#1abc9c",
  blue: "#3498db",
  amber: "#f39c12",
  red: "#e74c3c",
  green: "#27ae60",
  pink: "#e91e8c",
};

/* ─── Sections ───────────────────────────────────────────── */
const sections = [
  {
    id: "overview",
    icon: Shield,
    color: C.purple,
    title: "1. Privacy at a Glance",
    intro:
      "This summary gives you the key points. Read the full sections below for complete details.",
    highlights: [
      { icon: Database, color: C.purple, label: "What we collect", text: "Name, email, payment info, IP address, device data, and task activity." },
      { icon: Eye, color: C.teal, label: "Why we collect it", text: "To operate the platform, process payments, prevent fraud, and improve your experience." },
      { icon: Share2, color: C.blue, label: "Who we share with", text: "Payment processors, cloud hosting, and analytics partners — never sold to advertisers." },
      { icon: Lock, color: C.amber, label: "How we protect it", text: "AES-256 encryption at rest, TLS 1.3 in transit, and strict access controls." },
      { icon: UserCheck, color: C.green, label: "Your rights", text: "Access, correct, delete, and export your data at any time under GDPR/CCPA." },
      { icon: Cookie, color: C.pink, label: "Cookies", text: "Essential, analytics, and preference cookies — you control what's enabled." },
    ],
  },
  {
    id: "collection",
    icon: Database,
    color: C.purple,
    title: "2. Information We Collect",
    content: [
      {
        heading: "Information You Provide Directly",
        body: "When you create an account or use our services, we collect: full name and username; email address and password (stored as a salted bcrypt hash); profile photo (optional); date of birth (for age verification); payment and withdrawal information (PayPal email, bank account details, or crypto wallet addresses); identity verification documents when required (government-issued ID, selfie); and communications you send to our support team.",
      },
      {
        heading: "Information Collected Automatically",
        body: "When you interact with NextShop, we automatically collect: IP address and approximate geographic location; device type, operating system, and browser version; unique device identifiers; pages visited, features used, and time spent on the platform; referral URLs; task completion timestamps and proof screenshots you submit; click patterns and navigation paths within the platform.",
      },
      {
        heading: "Information from Third Parties",
        body: "We may receive information about you from third parties, including: social login providers (Google, Facebook) if you choose to sign in via OAuth — in this case we receive your name, email, and profile photo only; fraud detection partners who flag suspicious activity patterns; payment processors who confirm transaction statuses; and analytics providers who help us understand aggregate usage trends.",
      },
      {
        heading: "Sensitive Information",
        body: "NextShop does not intentionally collect sensitive personal information such as racial or ethnic origin, political opinions, religious beliefs, health data, or sexual orientation. Please do not submit such information through the platform. If you voluntarily provide it (e.g., in support tickets), we will handle it with heightened care and delete it once the matter is resolved.",
      },
    ],
  },
  {
    id: "use",
    icon: Settings,
    color: C.teal,
    title: "3. How We Use Your Information",
    content: [
      {
        heading: "Platform Operations",
        body: "We use your information primarily to operate and deliver NextShop's services: creating and managing your account; matching you with available micro tasks; processing task submissions and verifying completions; calculating and crediting earnings to your wallet; processing withdrawal requests through your chosen payment method; and sending essential transactional emails (account confirmation, withdrawal receipts, security alerts).",
      },
      {
        heading: "Fraud Prevention & Security",
        body: "Protecting platform integrity is critical. We use collected data to: detect and prevent fraudulent task completions; identify multi-account abuse and bot activity; investigate suspicious login attempts and unauthorized access; enforce our Terms and Conditions; and comply with legal obligations to report illegal activity to authorities.",
      },
      {
        heading: "Platform Improvement",
        body: "We analyze aggregated, anonymized usage data to: improve task matching algorithms; optimize page performance and load times; identify features that are underused or confusing; conduct A/B testing of new features; and develop new task categories based on usage patterns. This analysis does not identify individual users.",
      },
      {
        heading: "Communications & Marketing",
        body: "With your consent, we may send promotional emails about new task categories, earning opportunities, platform updates, and special offers. You can opt out of marketing emails at any time via the unsubscribe link in any email or by updating your notification preferences in your account settings. Opting out of marketing does not affect transactional communications.",
      },
      {
        heading: "Legal Compliance",
        body: "We may process your data to comply with applicable laws, respond to lawful requests from public authorities (courts, law enforcement), enforce our legal agreements, and protect the rights, property, or safety of NextShop, our users, and the public.",
      },
    ],
  },
  {
    id: "sharing",
    icon: Share2,
    color: C.blue,
    title: "4. How We Share Your Information",
    content: [
      {
        heading: "We Do Not Sell Your Data",
        body: "NextShop does not sell, rent, or trade your personal information to third parties for their marketing purposes. This is a core commitment. We share data only as described in this section.",
      },
      {
        heading: "Service Providers & Sub-Processors",
        body: "We share data with trusted third-party service providers who assist us in operating the platform, all bound by strict data processing agreements: payment processors (PayPal, Stripe, crypto gateways) to handle withdrawals; cloud hosting providers (AWS, Google Cloud) for infrastructure; email delivery services (SendGrid) for transactional and marketing emails; customer support tools (Zendesk) for help desk operations; analytics platforms (Mixpanel, Google Analytics) for usage insights — using anonymized or pseudonymized data only; and fraud detection services.",
      },
      {
        heading: "Employers on the Platform",
        body: "When you complete a task for an Employer, we share limited information necessary to verify completion: your username, task completion timestamp, and proof submission. We do not share your real name, contact details, payment information, or other personal data with Employers.",
      },
      {
        heading: "Legal Requirements & Safety",
        body: "We may disclose your information when required by applicable law, regulation, legal process, or enforceable governmental request; to enforce our Terms and Conditions or other agreements; to investigate potential violations; to detect, prevent, or address fraud, security, or technical issues; or to protect the rights, property, or safety of NextShop, our users, or others.",
      },
      {
        heading: "Business Transfers",
        body: "If NextShop is involved in a merger, acquisition, restructuring, or sale of assets, your personal information may be transferred as part of that transaction. We will notify you via email and/or prominent notice on the platform at least 30 days before your data is transferred and becomes subject to a different Privacy Policy.",
      },
    ],
  },
  {
    id: "security",
    icon: Lock,
    color: C.amber,
    title: "5. Data Security",
    content: [
      {
        heading: "Technical Safeguards",
        body: "We implement industry-standard security measures to protect your personal information: all data transmitted between your device and our servers is encrypted using TLS 1.3; data stored on our servers is encrypted at rest using AES-256; passwords are hashed using bcrypt with a unique salt; payment information is tokenized and never stored in plaintext; our infrastructure is hosted in SOC 2 Type II certified data centers with physical access controls; and we conduct regular penetration testing and security audits.",
      },
      {
        heading: "Organizational Safeguards",
        body: "Our security practices extend to how our team handles data: access to personal data is granted on a strict need-to-know basis using role-based access control; all staff with data access undergo annual privacy and security training; we maintain an incident response plan and conduct regular drills; and our development team follows secure coding practices and conducts code reviews.",
      },
      {
        heading: "Data Breach Response",
        body: "In the event of a data breach that poses a risk to your rights and freedoms, we will notify affected users within 72 hours of becoming aware of the breach (as required under GDPR), notify relevant supervisory authorities as required, describe the nature of the breach and data affected, and provide guidance on steps you can take to protect yourself.",
      },
      {
        heading: "Your Responsibility",
        body: "While we work hard to protect your data, you also play a role. Use a strong, unique password for your NextShop account, enable two-factor authentication (available in account settings), do not share your login credentials, log out of shared devices, and contact us immediately at security@nextshop.com if you suspect unauthorized access.",
      },
    ],
  },
  {
    id: "retention",
    icon: Server,
    color: C.red,
    title: "6. Data Retention",
    content: [
      {
        heading: "Retention Periods",
        body: "We retain your personal data for as long as necessary to provide our services and comply with legal obligations: active account data is retained for the lifetime of your account plus 90 days after deletion; task completion records and earnings history are retained for 7 years for financial and tax compliance purposes; payment transaction records are retained for 7 years as required by financial regulations; fraud investigation records may be retained for up to 5 years; support communications are retained for 3 years; and analytics data is anonymized after 26 months.",
      },
      {
        heading: "Account Deletion",
        body: "When you delete your account, we will: immediately revoke your access to the platform; anonymize your profile information within 30 days; delete your personal data from active systems within 90 days; and retain only the minimum data required for legal compliance (financial records, fraud prevention blacklists) for the periods described above. Backups containing your data may persist for up to 90 additional days before being overwritten.",
      },
      {
        heading: "Inactive Accounts",
        body: "If your account has been inactive for 24 consecutive months, we will send you an email notification. If you do not respond within 30 days, we may delete your account and associated personal data. Wallet balances below the withdrawal minimum at the time of deletion will be forfeited.",
      },
    ],
  },
  {
    id: "rights",
    icon: UserCheck,
    color: C.green,
    title: "7. Your Privacy Rights",
    content: [
      {
        heading: "Rights Under GDPR (EEA & UK Users)",
        body: "If you are located in the European Economic Area or United Kingdom, you have the following rights under the General Data Protection Regulation: Right of Access — obtain a copy of the personal data we hold about you; Right to Rectification — correct inaccurate or incomplete data; Right to Erasure ('Right to be Forgotten') — request deletion of your data subject to legal retention requirements; Right to Restrict Processing — limit how we use your data in certain circumstances; Right to Data Portability — receive your data in a structured, machine-readable format; Right to Object — object to processing based on legitimate interests or for direct marketing; and Right to Withdraw Consent — withdraw consent at any time where processing is based on consent.",
      },
      {
        heading: "Rights Under CCPA (California Users)",
        body: "If you are a California resident, the California Consumer Privacy Act (CCPA) grants you: the right to know what personal information we collect, use, disclose, and sell; the right to delete personal information we have collected from you; the right to opt out of the sale of your personal information (note: NextShop does not sell personal information); the right to non-discrimination for exercising your CCPA rights; and the right to correct inaccurate personal information.",
      },
      {
        heading: "How to Exercise Your Rights",
        body: "To exercise any of your privacy rights, submit a request to privacy@nextshop.com or through the Privacy Center in your account settings. We will verify your identity before processing requests to prevent unauthorized access. We respond to all verifiable requests within 30 days (GDPR) or 45 days (CCPA). If we need more time, we will inform you of the reason and the extension period.",
      },
      {
        heading: "Right to Lodge a Complaint",
        body: "If you believe we have violated your privacy rights, you have the right to lodge a complaint with your local supervisory authority. For EU users, this is your national Data Protection Authority. For UK users, this is the Information Commissioner's Office (ICO) at ico.org.uk. We encourage you to contact us first so we can attempt to resolve your concern directly.",
      },
    ],
  },
  {
    id: "cookies",
    icon: Cookie,
    color: C.pink,
    title: "8. Cookies & Tracking Technologies",
    content: [
      {
        heading: "What Are Cookies",
        body: "Cookies are small text files placed on your device by websites you visit. NextShop uses cookies and similar technologies (web beacons, pixel tags, local storage) to operate the platform, remember your preferences, analyze usage, and deliver a personalized experience.",
      },
      {
        heading: "Types of Cookies We Use",
        body: "Essential Cookies (always active): required for the platform to function — session management, authentication tokens, CSRF protection, and load balancing. These cannot be disabled. Preference Cookies: remember your settings such as language, currency display, and notification preferences. Analytics Cookies: help us understand how users interact with the platform using aggregated, anonymized data (Mixpanel, Google Analytics). Marketing Cookies: track activity across sites to deliver relevant promotional content — only set with your explicit consent.",
      },
      {
        heading: "Managing Your Cookie Preferences",
        body: "You can manage cookie preferences at any time through our Cookie Consent Center accessible from the footer of any page. You can also control cookies through your browser settings. Note that disabling essential cookies will prevent core platform functionality. Opting out of analytics cookies does not affect your ability to earn or withdraw.",
      },
      {
        heading: "Do Not Track",
        body: "Some browsers send a 'Do Not Track' (DNT) signal. NextShop currently responds to DNT signals by disabling non-essential tracking technologies for that session. We continue to monitor developments in DNT standards and will update our practices accordingly.",
      },
    ],
  },
  {
    id: "international",
    icon: Globe,
    color: C.blue,
    title: "9. International Data Transfers",
    content: [
      {
        heading: "Where Your Data Is Processed",
        body: "NextShop is headquartered in the United Kingdom and operates infrastructure in the United States and European Union via AWS and Google Cloud. If you access our services from outside these regions, your information may be transferred to and processed in countries where data protection laws may differ from those in your country.",
      },
      {
        heading: "Safeguards for International Transfers",
        body: "For transfers of personal data from the EEA or UK to third countries, we rely on: Standard Contractual Clauses (SCCs) approved by the European Commission; the UK International Data Transfer Agreement (IDTA); adequacy decisions where the destination country provides an adequate level of data protection; and binding corporate rules for intra-group transfers.",
      },
      {
        heading: "Privacy Shield",
        body: "Although the EU-US Privacy Shield framework was invalidated by the Schrems II ruling, we continue to comply with the Privacy Shield Principles as a matter of good practice while relying on SCCs as our primary legal transfer mechanism.",
      },
    ],
  },
  {
    id: "children",
    icon: AlertTriangle,
    color: C.red,
    title: "10. Children's Privacy",
    content: [
      {
        heading: "Age Restriction",
        body: "NextShop is not directed to, and does not knowingly collect personal information from, individuals under the age of 18. By creating an account, you represent that you are at least 18 years old. If we become aware that we have collected personal information from a child under 18 without parental consent, we will take immediate steps to delete that information and terminate the account.",
      },
      {
        heading: "Reporting Underage Accounts",
        body: "If you believe a child under 18 has created an account on NextShop, please report it immediately to safety@nextshop.com. We will investigate and take appropriate action within 48 hours.",
      },
    ],
  },
  {
    id: "updates",
    icon: RefreshCw,
    color: C.purple,
    title: "11. Policy Updates",
    content: [
      {
        heading: "How We Notify You",
        body: "We may update this Privacy Policy from time to time to reflect changes in our data practices, legal requirements, or platform features. When we make material changes, we will: send a notification email to your registered address at least 14 days before the changes take effect; display a prominent banner on the platform; update the 'Last Updated' date at the top of this page; and maintain an archive of previous versions accessible upon request.",
      },
      {
        heading: "Continued Use",
        body: "Your continued use of NextShop after the effective date of a revised Privacy Policy constitutes your acceptance of the changes. If you do not agree with the updated policy, you must stop using the platform and may request deletion of your account and data.",
      },
    ],
  },
  {
    id: "contact",
    icon: Mail,
    color: C.teal,
    title: "12. Contact & Data Protection Officer",
    content: [
      {
        heading: "Data Protection Officer",
        body: "NextShop has appointed a Data Protection Officer (DPO) to oversee compliance with data protection laws. You can contact our DPO directly at dpo@nextshop.com for any privacy-related concerns, data subject access requests, or questions about how we handle your personal information.",
      },
      {
        heading: "General Privacy Inquiries",
        body: "For general privacy questions: Email: privacy@nextshop.com | Response time: within 30 days. For urgent security issues: security@nextshop.com | Response time: within 24 hours. Postal address: NextShop Ltd., Data Privacy Team, 20 Fenchurch Street, London, EC3M 3BY, United Kingdom.",
      },
    ],
  },
];

/* ─── Rights cards ──────────────────────────────────────── */
const rightsCards = [
  { icon: Eye, color: C.purple, title: "Right to Access", desc: "Request a full copy of the personal data we hold about you." },
  { icon: FileText, color: C.teal, title: "Right to Correct", desc: "Fix inaccurate or outdated information in your profile." },
  { icon: Trash2, color: C.red, title: "Right to Delete", desc: "Ask us to erase your data, subject to legal retention rules." },
  { icon: Download, color: C.blue, title: "Right to Portability", desc: "Export your data in a machine-readable format (JSON/CSV)." },
  { icon: ToggleLeft, color: C.amber, title: "Right to Object", desc: "Object to processing for marketing or legitimate interests." },
  { icon: Key, color: C.green, title: "Right to Restrict", desc: "Limit how we use your data in certain circumstances." },
];

/* ─── ToC ───────────────────────────────────────────────── */
function TableOfContents({ active, onClick }: { active: string; onClick: (id: string) => void }) {
  return (
    <div className="sticky top-28 rounded-2xl overflow-hidden"
      style={{ background: "#fff", border: "1px solid rgba(155,89,182,0.12)", boxShadow: "0 4px 24px rgba(155,89,182,0.08)" }}>
      <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(155,89,182,0.1)", background: "linear-gradient(135deg,#f8f2fe,#f0fdfb)" }}>
        <div className="flex items-center gap-2">
          <Shield size={15} style={{ color: C.purple }} />
          <span className="text-sm font-bold" style={{ fontFamily: "'Space Grotesk',sans-serif", color: "#1a1a2e" }}>
            Privacy Policy
          </span>
        </div>
      </div>
      <nav className="p-2.5">
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

/* ─── Section card ──────────────────────────────────────── */
function SectionCard({ section }: { section: typeof sections[0] }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <motion.div id={section.id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="rounded-2xl overflow-hidden"
      style={{ background: "#fff", border: "1px solid rgba(155,89,182,0.1)", boxShadow: "0 2px 16px rgba(155,89,182,0.05)" }}>

      <button onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-6 py-5 text-left transition-colors hover:bg-purple-50/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
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

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}>
            <div className="px-6 pb-6" style={{ borderTop: "1px solid rgba(155,89,182,0.07)" }}>

              {/* Overview section gets a highlight grid instead */}
              {"highlights" in section && section.highlights ? (
                <>
                  {section.intro && (
                    <p className="pt-5 text-sm leading-relaxed mb-5" style={{ color: "#6b7280" }}>{section.intro}</p>
                  )}
                  <div className="grid sm:grid-cols-2 gap-3">
                    {section.highlights.map((h) => (
                      <div key={h.label} className="flex items-start gap-3 rounded-xl p-3.5"
                        style={{ background: `${h.color}07`, border: `1px solid ${h.color}18` }}>
                        <h.icon size={17} className="mt-0.5 shrink-0" style={{ color: h.color }} />
                        <div>
                          <div className="font-semibold text-xs mb-0.5" style={{ color: "#1a1a2e" }}>{h.label}</div>
                          <div className="text-xs leading-relaxed" style={{ color: "#6b7280" }}>{h.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                "content" in section && section.content?.map((c, i) => (
                  <div key={i} className={i === 0 ? "pt-5" : "pt-5 mt-4"}
                    style={{ borderTop: i > 0 ? "1px solid rgba(155,89,182,0.06)" : "none" }}>
                    <h3 className="font-semibold text-sm mb-2"
                      style={{ color: section.color, fontFamily: "'Space Grotesk',sans-serif" }}>
                      {c.heading}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#6b7280" }}>{c.body}</p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Main component ────────────────────────────────────── */
export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 600);
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.getBoundingClientRect().top <= 160) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Navbar />
      <main style={{ background: "#faf7fd", minHeight: "100vh" }}>

        {/* ── Hero ── */}
        <section className="pt-32 pb-16 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg,#f8f2fe 0%,#f0fdfb 100%)", borderBottom: "1px solid rgba(155,89,182,0.1)" }}>
          {/* bg blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full"
              style={{ background: "radial-gradient(circle,rgba(155,89,182,0.1),transparent 70%)", filter: "blur(50px)" }} />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full"
              style={{ background: "radial-gradient(circle,rgba(26,188,156,0.09),transparent 70%)", filter: "blur(50px)" }} />
            {/* Decorative shield watermark */}
            <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-[0.035] hidden lg:block">
              <Shield size={320} style={{ color: C.purple }} />
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <div className="inline-flex items-center gap-2 bg-white border border-purple-100 rounded-full px-4 py-2 mb-5 shadow-sm text-xs font-semibold"
                style={{ color: C.purple }}>
                <Lock size={13} /> Legal · Privacy Policy
              </div>

              <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(2rem,5vw,3.2rem)", fontWeight: 800, color: "#1a1a2e", lineHeight: 1.15 }}>
                Your Privacy,{" "}
                <span className="text-gradient">Our Priority</span>
              </h1>

              <p className="mt-4 text-base max-w-xl mx-auto leading-relaxed" style={{ color: "#6b7280" }}>
                We believe privacy is a right, not a feature. This policy explains exactly what data we collect, why we need it, how we protect it, and the full control you have over it.
              </p>

              {/* Meta pills */}
              <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                {[
                  { icon: RefreshCw, text: "Last Updated: January 15, 2025" },
                  { icon: Globe, text: "Effective: February 1, 2025" },
                  { icon: Shield, text: "GDPR & CCPA Compliant" },
                  { icon: Users, text: "Applies to all NextShop users" },
                ].map(({ icon: Icon, text }) => (
                  <span key={text}
                    className="inline-flex items-center gap-1.5 bg-white border border-purple-100 rounded-full px-3 py-1.5 text-xs shadow-sm"
                    style={{ color: "#6b7280" }}>
                    <Icon size={12} style={{ color: C.purple }} />{text}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Commitment banner ── */}
        <section style={{ background: "#fff", borderBottom: "1px solid rgba(155,89,182,0.08)" }}>
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: Shield, color: C.purple, title: "We Never Sell Your Data", desc: "Your personal information is never sold or traded to third parties." },
                { icon: Lock, color: C.teal, title: "Bank-Grade Encryption", desc: "AES-256 at rest and TLS 1.3 in transit protect every byte." },
                { icon: UserCheck, color: C.green, title: "Full GDPR & CCPA Compliance", desc: "Your rights are respected regardless of where you live." },
              ].map((c) => (
                <motion.div key={c.title}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.4 }}
                  className="flex items-start gap-3 rounded-2xl p-4"
                  style={{ background: `${c.color}07`, border: `1px solid ${c.color}18` }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${c.color}15` }}>
                    <c.icon size={20} style={{ color: c.color }} />
                  </div>
                  <div>
                    <div className="font-bold text-sm mb-0.5" style={{ fontFamily: "'Space Grotesk',sans-serif", color: "#1a1a2e" }}>{c.title}</div>
                    <div className="text-xs leading-relaxed" style={{ color: "#6b7280" }}>{c.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Your rights spotlight ── */}
        <section style={{ background: "linear-gradient(135deg,#f8f2fe,#f0fdfb)", borderBottom: "1px solid rgba(155,89,182,0.08)" }}>
          <div className="max-w-6xl mx-auto px-6 py-12">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} className="text-center mb-8">
              <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 800, color: "#1a1a2e" }}>
                Your Data, <span className="text-gradient">Your Rights</span>
              </h2>
              <p className="mt-2 text-sm" style={{ color: "#6b7280" }}>
                Exercise any right by emailing <a href="mailto:privacy@nextshop.com" style={{ color: C.purple }}>privacy@nextshop.com</a> — we respond within 30 days.
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rightsCards.map((r, i) => (
                <motion.div key={r.title}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  className="bg-white rounded-2xl p-5 flex items-start gap-3"
                  style={{ border: `1px solid ${r.color}18`, boxShadow: `0 2px 12px ${r.color}0d` }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${r.color}12` }}>
                    <r.icon size={17} style={{ color: r.color }} />
                  </div>
                  <div>
                    <div className="font-bold text-sm mb-1" style={{ fontFamily: "'Space Grotesk',sans-serif", color: "#1a1a2e" }}>{r.title}</div>
                    <div className="text-xs leading-relaxed" style={{ color: "#6b7280" }}>{r.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Main content grid ── */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">

            {/* Sticky ToC */}
            <aside className="hidden lg:block">
              <TableOfContents active={activeSection} onClick={scrollTo} />
            </aside>

            {/* Section cards */}
            <div className="space-y-4">
              {sections.map((s) => <SectionCard key={s.id} section={s} />)}

              {/* Cookie preference CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5"
                style={{ background: "linear-gradient(135deg,rgba(155,89,182,0.08),rgba(26,188,156,0.06))", border: "1.5px solid rgba(155,89,182,0.18)" }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg,#9b59b6,#8e44ad)" }}>
                  <Cookie size={26} style={{ color: "#fff" }} />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="font-bold text-base mb-1" style={{ fontFamily: "'Space Grotesk',sans-serif", color: "#1a1a2e" }}>
                    Manage Your Cookie Preferences
                  </div>
                  <div className="text-sm" style={{ color: "#6b7280" }}>
                    Control which cookies NextShop uses. Essential cookies are always active; all others are optional.
                  </div>
                </div>
                <motion.a href="#" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="btn-primary px-5 py-2.5 rounded-xl font-semibold text-sm shrink-0 glow-purple">
                  Cookie Settings
                </motion.a>
              </motion.div>

              {/* Contact DPO */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl p-6 text-center"
                style={{ background: "#fff", border: "1px solid rgba(155,89,182,0.12)", boxShadow: "0 2px 16px rgba(155,89,182,0.06)" }}>
                <Fingerprint size={30} className="mx-auto mb-3" style={{ color: C.purple }} />
                <h3 className="font-bold text-base mb-2" style={{ fontFamily: "'Space Grotesk',sans-serif", color: "#1a1a2e" }}>
                  Questions About Your Privacy?
                </h3>
                <p className="text-sm max-w-md mx-auto mb-4" style={{ color: "#6b7280" }}>
                  Our Data Protection Officer is here to help. Reach out at any time — we respond to all privacy inquiries within 30 days.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <motion.a href="mailto:privacy@nextshop.com"
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className="btn-primary px-6 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center gap-2 glow-purple">
                    <Mail size={15} /> Email Our DPO
                  </motion.a>
                  <motion.a href="/terms-and-conditions"
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className="btn-outline px-6 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center gap-2">
                    <FileText size={15} /> Read Terms & Conditions
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll to top */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}
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