"use client"

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

import Link from 'next/link';
import PooSubForm from '@/components/worker/jobs/PooSubForm';
import HeaderCard from '@/components/worker/jobs/HeaderCard';
import JobDiscription from '@/components/worker/jobs/JobDiscription';
import { useGetJob } from '@/hooks/use-jobs';
import { useParams } from 'next/navigation';
import Alert from '@/components/worker/Alert';

// Brand Icons

export default function JobApplyPage() {
  const params = useParams();
  const jobId = params?.id as string;
  const { data } = useGetJob(jobId);

  if (data?.permission.jobsSubmitLimit) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] pt-20 pb-12 font-poppins">
        {/* Container: Matched to max-w-4xl like Jobs List */}
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <Alert
            title="Job submission limit reached"
            note="You’ve reached your job submission limit. Please upgrade your plan to continue."
          />
        </div>
      </div>
    )
  }

  if (data?.permission.limitParDay && !data?.permission.jobsSubmitLimit) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] pt-20 pb-12 font-poppins">
        {/* Container: Matched to max-w-4xl like Jobs List */}
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <Alert
            title="Daily job submission limit reached"
            note="You’ve reached your job submission limit for today. Please try again tomorrow."
          />
        </div>
      </div>
    )
  }


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
        <HeaderCard />

        {/* --- INSTRUCTIONS SECTION --- */}
        <JobDiscription />

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