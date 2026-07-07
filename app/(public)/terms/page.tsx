import type { Metadata } from "next";
import TermsPage from "@/components/terms/TableOfContents";

export const metadata: Metadata = {
  title: "Terms and Conditions – NextShop Micro Jobs Platform",
  description:
    "Read NextShop's Terms and Conditions. Understand your rights, obligations, and rules for using our micro jobs platform including likes, comments, shares, and subscriptions.",
  keywords: "NextShop terms and conditions, micro jobs terms of service, earner agreement, platform rules",
  openGraph: {
    title: "Terms and Conditions – NextShop",
    description: "Review the terms governing your use of the NextShop micro jobs platform.",
    type: "website",
  },
};

export default function Page() {
  return <TermsPage />;
}