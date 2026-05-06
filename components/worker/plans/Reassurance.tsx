import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";

function Reassurance() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-24 p-12 bg-white rounded-[40px] shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-10"
        >
            <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                    <ShieldCheck size={32} />
                </div>
                <div>
                    <h4 className="text-xl font-bold text-slate-900">Secure Kingdom</h4>
                    <p className="text-slate-500 text-sm font-medium">All plans are protected by 256-bit encryption.</p>
                </div>
            </div>
            <div className="flex gap-4">
                <div className="text-right hidden md:block">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Need custom limits?</p>
                    <p className="text-slate-900 font-bold">Contact our Royal Support</p>
                </div>
                <Button variant="outline" className="rounded-2xl h-14 px-8 border-slate-200 font-bold group">
                    View FAQ <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
        </motion.div>
    )
}

export default Reassurance;