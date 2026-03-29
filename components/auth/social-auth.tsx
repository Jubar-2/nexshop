import { Button } from "@/components/ui/button";

export const SocialAuth = ({ text }: { text: string }) => (
    <div className="space-y-4 w-full">
        <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-slate-400 font-bold text-xs">OR</span>
            <div className="flex-grow border-t border-slate-200"></div>
        </div>
        <Button variant="outline" className="w-full h-14 rounded-full border-2 border-slate-200 font-bold text-slate-600 flex items-center justify-center gap-3 text-lg shadow-sm">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.94 0 3.51.68 4.75 1.81l3.55-3.55C18.1 1.31 15.26.4 12 .4 7.31.4 3.32 3.1 1.25 7.01l4.12 3.19c1.01-3.03 3.84-5.16 6.63-5.16z" />
                <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.3h6.45c-.28 1.48-1.11 2.74-2.36 3.58l3.68 2.85c2.14-1.98 3.38-4.89 3.38-8.46z" />
                <path fill="#FBBC05" d="M5.37 14.17c-.26-.78-.41-1.6-.41-2.47s.15-1.69.41-2.47L1.25 7.01C.45 8.5.01 10.2.01 12c0 1.8.44 3.5 1.24 4.99l4.12-2.82z" />
                <path fill="#34A853" d="M12 23.6c3.24 0 5.95-1.08 7.93-2.91l-3.68-2.85c-1.1.74-2.51 1.18-4.25 1.18-3.34 0-6.17-2.25-7.18-5.27l-4.12 2.82c2.07 3.91 6.06 6.61 10.75 6.61z" />
            </svg>
            {text}
        </Button>
    </div>
);