import PrivacyPage from "@/components/privacy/PrivacyPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy – Nexshop Micro Jobs Platform",
    description:
        "Read NextShop's Privacy Policy to understand how we collect, use, store, and protect your personal data when you use our micro jobs platform for likes, comments, shares, and subscriptions.",
    keywords:
        "NextShop privacy policy, data protection, GDPR, personal data micro jobs, user privacy, cookie policy",
    openGraph: {
        title: "Privacy Policy – NextShop",
        description:
            "Learn how NextShop handles your personal data, cookies, and privacy rights on our micro jobs platform.",
        type: "website",
        url: "https://nexshop.net/privacy",
    },
    alternates: {
        canonical: "https://nexshop.net/privacy",
    },
};

export default function Page() {
    return <PrivacyPage />;
}