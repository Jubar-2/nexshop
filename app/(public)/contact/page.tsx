import ContactPage from "@/components/contact/ContactPage";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Contact Us – NextShop Micro Jobs Platform",
  description:
    "Get in touch with the NextShop team. Contact us via WhatsApp, email, or social media for support, partnerships, or general inquiries about our micro jobs platform.",
  keywords:
    "contact NextShop, NextShop support, WhatsApp support, micro jobs help, NextShop email, contact micro jobs platform",
  openGraph: {
    title: "Contact NextShop – We're Here to Help",
    description:
      "Reach the NextShop team via WhatsApp, email, or social media. Fast responses guaranteed.",
    type: "website",
    url: "https://nexshop.net/contact",
  },
  alternates: {
    canonical: "https://nexshop.net/contact",
  },
};

export default function Page() {
  return <ContactPage />;
}