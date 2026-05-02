"use client";

import { ReactElement } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, ArrowUpRight } from "lucide-react";

// Strict color type
type ColorType = "emerald" | "amber" | "blue" | "red";

// Props type
interface Props {
  title: string;
  value: string;
  icon: ReactElement;
  color: ColorType;
  trend: string;
  isLoading?: boolean;
  isError?: boolean;
}

// Color map (type-safe)
const colorMap: Record<ColorType, { bg: string; text: string }> = {
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600" },
  amber: { bg: "bg-amber-50", text: "text-amber-600" },
  blue: { bg: "bg-blue-50", text: "text-blue-600" },
  red: { bg: "bg-red-50", text: "text-red-600" },
};

export default function StatCard({
  title,
  value,
  icon,
  color,
  trend,
  isLoading = false,
  isError = false,
}: Props) {
  const { bg, text } = colorMap[color];

  // Better icon handling (no cloneElement needed)
  const Icon = icon.type;

  // =====================
  // LOADING STATE
  // =====================
  if (isLoading) {
    return (
      <Card className="bg-white border-slate-100 shadow-sm rounded-2xl p-6 hover:shadow-md transition-all">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
              {title}
            </p>
            <Skeleton className="h-8 w-28 bg-slate-200" />
          </div>

          <div className={`p-3 rounded-2xl ${bg} ${text}`}>
            <Icon size={24} />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 text-[11px] font-bold text-slate-400 border-t border-slate-50 pt-4">
          <ArrowUpRight
            size={14}
            className={color === "red" ? "text-red-500" : "text-emerald-500"}
          />
          {trend}
        </div>
      </Card>
    );
  }

  // =====================
  //  ERROR STATE
  // =====================
  if (isError) {
    return (
      <Card className="bg-white border-slate-100 shadow-sm rounded-2xl p-6 hover:shadow-md transition-all">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
              {title}
            </p>

            <h2 className={`text-3xl font-black flex items-center gap-2 ${text}`}>
              <AlertCircle size={18} />
              --.--
            </h2>
          </div>

          <div className={`p-3 rounded-2xl ${bg} ${text}`}>
            <Icon size={24} />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 text-[11px] font-bold text-slate-400 border-t border-slate-50 pt-4">
          <ArrowUpRight
            size={14}
            className={color === "red" ? "text-red-500" : "text-emerald-500"}
          />
          {trend}
        </div>
      </Card>
    );
  }

  // =====================
  // SUCCESS STATE
  // =====================
  return (
    <Card className="bg-white border-slate-100 shadow-sm rounded-2xl p-6 hover:shadow-md transition-all">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
            {title}
          </p>

          <h2 className={`text-3xl font-black ${text}`}>
            {value}
          </h2>
        </div>

        <div className={`p-3 rounded-2xl ${bg} ${text}`}>
          <Icon size={24} />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 text-[11px] font-bold text-slate-400 border-t border-slate-50 pt-4">
        <ArrowUpRight
          size={14}
          className={color === "red" ? "text-red-500" : "text-emerald-500"}
        />
        {trend}
      </div>
    </Card>
  );
}