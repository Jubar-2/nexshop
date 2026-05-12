"use client"

import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Clock,
  ShieldCheck,
  Image as ImageIcon,
  Send,
  Link as LinkIcon
} from 'lucide-react';
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { JobSubmissionInput, JobSubmissionSchema } from '@/lib/validations/jobs';
import { zodResolver } from '@hookform/resolvers/zod';
import PooSubForm from '@/components/worker/jobs/PooSubForm';

// Brand Icons
const BrandIcons = {
  Youtube: ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
  )
};

export default function JobApplyPage() {

  return (
    <div className="min-h-screen bg-[#F0F2F5] pt-20 pb-12 font-poppins">
      {/* Container: Matched to max-w-4xl like Jobs List */}
      <div className="max-w-4xl mx-auto px-4 space-y-6">

        {/* --- TOP NAVIGATION --- */}
        <div className="flex items-center justify-between px-1">
          <Link href="/dashboard/jobs" className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors font-bold text-sm group">
            <div className="bg-white p-2 rounded-full shadow-sm group-hover:bg-emerald-50 transition-colors"><ArrowLeft size={18} /></div>
            Back to All Jobs
          </Link>
          <Badge className="bg-emerald-100 text-emerald-700 border-none font-black px-4 py-1.5 rounded-full uppercase tracking-widest text-[10px]">
            Active Task
          </Badge>
        </div>

        {/* --- MAIN HEADER CARD --- */}
        <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-inner">
                <BrandIcons.Youtube className="text-[#FF0000] w-12 h-12" />
              </div>
              <div className="grow text-center md:text-left space-y-2">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">Watch & Like YouTube Video (5 Mins)</h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-slate-400 text-[11px] font-bold uppercase tracking-tight">
                  <span className="flex items-center gap-2"><Clock size={16} /> 5 Min Task</span>
                  <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-blue-500" /> Admin Verified</span>
                  <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> 98% Success</span>
                </div>
              </div>
              <div className="bg-emerald-50 px-8 py-5 rounded-2xl text-center border border-emerald-100/50">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Total Reward</p>
                <h4 className="text-3xl font-black text-emerald-600 tracking-tighter">৳15.00</h4>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* --- INSTRUCTIONS SECTION --- */}
        <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800 uppercase tracking-wide">
              <LinkIcon className="text-blue-500" size={18} /> Step-by-Step Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">

            <Card className="bg-[#F0F2F5] p-5 ">
              <p className="font-italic">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi non vitae consequatur nemo debitis odit iusto libero tempore dolorum explicabo aliquid, assumenda sint! Illo animi quidem minima. Sint, illo hic.
              </p>
            </Card>


            <div className="space-y-8 py-8">
              {/* <InstructionItem step="1" text="Open the YouTube Link" subtext="You will be redirected to the task video." /> */}
              <div className="ml-12">
                <Button className="bg-slate-900 hover:bg-black text-white rounded-xl h-12 px-8 font-black flex gap-2 transition-all active:scale-95 shadow-md">
                  Go to Link <ExternalLink size={16} />
                </Button>
                <p className="text-[11px] text-blue-500 font-bold mt-3 underline italic cursor-pointer truncate">https://youtube.com/task/v78x2a...</p>
              </div>
              {/* <InstructionItem step="2" text="Watch for 3+ Minutes" subtext="Crucial: Your watch time must be verified by admin." /> */}
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex gap-4">
              <AlertTriangle className="text-amber-500 shrink-0" size={20} />
              <p className="text-[11px] text-amber-700 font-bold leading-relaxed uppercase tracking-tight">
                Note: Do not unsubscribe after payment. We verify active subscribers weekly.
              </p>
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <InstructionItem step="1" text="Open the YouTube Link" subtext="You will be redirected to the task video." />
                <div className="ml-12">
                  <Button className="bg-slate-900 hover:bg-black text-white rounded-xl h-12 px-8 font-black flex gap-2 transition-all active:scale-95 shadow-md">
                    Go to Video <ExternalLink size={16} />
                  </Button>
                  <p className="text-[11px] text-blue-500 font-bold mt-3 underline italic cursor-pointer truncate">https://youtube.com/task/v78x2a...</p>
                </div>
                <InstructionItem step="2" text="Watch for 3+ Minutes" subtext="Crucial: Your watch time must be verified by admin." />
              </div>
              <div className="space-y-8">
                <InstructionItem step="3" text="Like & Subscribe" subtext="Interact with the video to qualify for the reward." />
                <InstructionItem step="4" text="Submit Screenshot" subtext="Take a screenshot showing your 'Like' status." />

                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex gap-4">
                  <AlertTriangle className="text-amber-500 shrink-0" size={20} />
                  <p className="text-[11px] text-amber-700 font-bold leading-relaxed uppercase tracking-tight">
                    Note: Do not unsubscribe after payment. We verify active subscribers weekly.
                  </p>
                </div>
              </div>
            </div> */}

          </CardContent>
        </Card>

        {/* --- PROOF SUBMISSION FORM --- */}
        <PooSubForm />
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: Instruction Item ---
const InstructionItem = ({ step, text, subtext }: { step: string, text: string, subtext: string }) => (
  <div className="flex items-start gap-4">
    <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-md shrink-0">
      {step}
    </div>
    <div>
      <h4 className="font-bold text-slate-800 text-lg leading-none mb-1">{text}</h4>
      <p className="text-[11px] text-slate-500 font-bold leading-tight uppercase tracking-tight">{subtext}</p>
    </div>
  </div>
);

const Badge = ({ children, className }: { children: React.ReactNode, className: string }) => (
  <span className={`inline-flex items-center ${className}`}>
    {children}
  </span>
);