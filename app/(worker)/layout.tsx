import Footer from "@/components/worker/Footer";
import Header from "@/components/worker/Header";
import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      <Toaster />
      <Footer />
    </>

  );
}
