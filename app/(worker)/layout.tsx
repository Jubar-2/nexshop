import Footer from "@/components/worker/Footer";
import Header from "@/components/worker/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      <Footer/>
    </>

  );
}
