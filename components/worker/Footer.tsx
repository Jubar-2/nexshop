import Link from 'next/link';

const Footer = () => {
  // Highly professional approach: Use dynamic year
  const currentYear = 2026; // Hardcoded to match your image exactly

  return (
    <footer className="w-full bg-white border-t border-slate-100 px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 font-sans">
      
      {/* LEFT SECTION: Copyright */}
      <div className="text-sm text-slate-500 font-medium tracking-tight">
        © {currentYear} <span className="font-bold text-slate-800">Nexshop</span>. All rights reserved
      </div>

      {/* RIGHT SECTION: Links */}
      <nav className="flex items-center gap-8 text-sm font-semibold text-slate-600">
        <Link 
          href="/terms" 
          className="hover:text-emerald-600 transition-colors underline-offset-4 hover:underline"
        >
          Terms
        </Link>
        <Link 
          href="/privacy" 
          className="hover:text-emerald-600 transition-colors underline-offset-4 hover:underline"
        >
          Privacy
        </Link>
        <Link 
          href="/contact" 
          className="hover:text-emerald-600 transition-colors underline-offset-4 hover:underline"
        >
          Contact
        </Link>
      </nav>
      
    </footer>
  );
};

export default Footer;