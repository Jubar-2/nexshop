"use client";

import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

// allowed colors only
type ColorType = "blue" | "emerald" | "slate";

// props type
interface SummaryCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    color: ColorType;
}

// color map with strict typing
const colorClasses: Record<ColorType, { bg: string; text: string }> = {
    blue: { bg: "bg-blue-50", text: "text-blue-600" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600" },
    slate: { bg: "bg-slate-50", text: "text-slate-500" },
};

export default function SummaryCard({
    title,
    value,
    icon,
    color,
}: SummaryCardProps) {
    const { bg, text } = colorClasses[color];

    return (
        <Card className="bg-white border-none shadow-sm rounded-2xl p-6 flex items-center justify-between">
            <div>
                <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">
                    {title}
                </p>

                <h2 className={`text-2xl font-black ${text}`}>
                    {value}
                </h2>
            </div>
            <div className={`p-3 rounded-xl ${bg} ${text}`}>
                {icon}
            </div>
        </Card>
    );
}