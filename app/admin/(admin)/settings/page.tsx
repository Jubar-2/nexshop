"use client"

import { useState, useEffect } from 'react';
import {
    Dices,
    Save,
    ShieldCheck,
    AlertCircle,
    Settings2,
    Lock
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import ReferralTier from '@/components/admin/settings/settings';
import { useGetSettings, useUpdateSettings } from '@/hooks/admin/use-settings';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';

type SettingsFormData = {
    luckySpin: string;
    refGen1: string;
    refGen2: string;
    refGen3: string;
    jobParRefresh: string;
    withdrawFee: string;
    withdrawLimit: string;
};

export default function AdminSettingsPage() {

    const queryClient = useQueryClient();

    // --- STATE FOR HIERARCHICAL LOGIC ---
    const [luckySpin, setLuckySpin] = useState<boolean>(false);
    const [gen1, setGen1] = useState<boolean>(false);
    const [gen2, setGen2] = useState<boolean>(false);
    const [gen3, setGen3] = useState<boolean>(false);

    const { data } = useGetSettings();
    const { mutate } = useUpdateSettings();

    const settingsData = data;

    // Initialize the Form
    const {
        register,
        handleSubmit,
        reset
    } = useForm<SettingsFormData>();


    // --- AUTO-OFF DEPENDENCY LOGIC ---
    // useEffect(() => {
    //     if (!gen1) {
    //         setGen2(false);
    //         setGen3(false);
    //     }
    // }, [gen1]);

    // useEffect(() => {
    //     if (!gen2) {
    //         setGen3(false);
    //     }
    // }, [gen2]);

    useEffect(() => {
        if (!settingsData) return;

        reset({
            luckySpin: settingsData?.luckySpin?.value,
            refGen1: settingsData?.gen_1?.value,
            refGen2: settingsData?.gen_2?.value,
            refGen3: settingsData?.gen_3?.value,
            jobParRefresh: settingsData?.job_par_refresh.value,
            withdrawFee: settingsData?.withdraw_fee?.value,
            withdrawLimit: settingsData?.withdraw_limit?.value,
        });

        const timer = setTimeout(() => {
            setGen1(settingsData.gen_1?.switch || false);
            setGen2(settingsData.gen_2?.switch || false);
            setGen3(settingsData.gen_3?.switch || false);
            setLuckySpin(settingsData.luckySpin?.switch || false);
        }, 0);

        return () => clearTimeout(timer);

    }, [settingsData]);

    const handelGen1 = () => {
        console.log("gen one click")
        if (gen1) {
            setGen1(false)
            setGen2(false);
            setGen3(false);
        } else {
            setGen1(true)
            setGen2(true);
            setGen3(true);
        }
    }

    const handelGen2 = () => {
        console.log("gen one click")
        if (gen2) {
            setGen2(false);
            setGen3(false);
        } else {
            setGen2(true);
            setGen3(true);
        }
    }

    const fromSubmit = (data: {
        luckySpin: string;
        refGen1: string;
        refGen2: string;
        refGen3: string;
        jobParRefresh: string;
        withdrawFee: string;
        withdrawLimit: string;

        // switches
        // luckySpinSwitch: boolean;
        // gen_2Switch: boolean;
        // gen_1SpinSwitch: boolean;
        // gen_3Switch: boolean;
    }) => {

        mutate({
            luckySpin: +data.luckySpin,
            gen_1: +data.refGen1,
            gen_2: +data.refGen2,
            gen_3: +data.refGen3,
            job_par_refresh: +data.jobParRefresh,
            withdraw_fee: +data.withdrawFee,
            withdraw_limit: +data.withdrawLimit,

            // switches
            luckySpinSwitch: gen1,
            gen_2Switch: gen2,
            gen_1SpinSwitch: gen1,
            gen_3Switch: gen3,
        },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
                }
            }
        )
    }

    return (
        <div className="min-h-screen w-full bg-[#F8FAFC] p-6 md:p-12 font-poppins">
            <form onSubmit={handleSubmit(fromSubmit)}>
                <div className="max-w-4xl mx-auto space-y-10">

                    {/* --- HEADER --- */}
                    <div className="flex items-center justify-between border-b border-slate-200 pb-8">
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">System Logic</h1>
                            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Configure Dependencies & Thresholds</p>
                        </div>
                        <div className="p-4 bg-white rounded-3xl shadow-sm border border-slate-100 text-orange-600">
                            <Settings2 size={32} />
                        </div>
                    </div>

                    {/* --- SECTION 1: LUCKY SPIN --- */}
                    <section className="space-y-4">
                        <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Gaming & Engagement</h2>
                        <Card className={`border-none rounded-[2.5rem] transition-all duration-500 ${luckySpin ? 'bg-white shadow-sm' : 'bg-slate-100 opacity-70'}`}>
                            <CardContent className="p-10 flex flex-col md:flex-row items-center gap-10">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-4 rounded-2xl ${luckySpin ? 'bg-orange-600 text-white shadow-xl shadow-orange-200' : 'bg-slate-200 text-slate-400'}`}>
                                            <Dices size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-800">Lucky Spin Service</h3>
                                            <p className="text-xs font-bold text-slate-400 uppercase">Enable daily rewards module</p>
                                        </div>
                                    </div>
                                    <div className={`space-y-2 pt-2 transition-all ${luckySpin ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                                        <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Min. Income to Enable Service</Label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-300">৳</span>
                                            <Input
                                                {...register("luckySpin")}
                                                className="h-14 pl-10 rounded-2xl border-slate-100 bg-slate-50 font-black text-lg focus:bg-white focus:border-orange-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="shrink-0 flex flex-col items-center gap-3">
                                    <Switch
                                        // {...register("luckySpinSwitch")}
                                        checked={luckySpin}
                                        onCheckedChange={setLuckySpin}
                                        className="scale-[1.5] data-[state=checked]:bg-orange-600"
                                    />
                                    <Badge className={luckySpin ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}>
                                        {luckySpin ? 'Enabled' : 'Disabled'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {/* --- SECTION 2: REFERRAL SYSTEM (WITH NESTED LOGIC) --- */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Tiered Referral Hierarchy</h2>
                            <div className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase italic">
                                <AlertCircle size={14} /> Parent logic enabled
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* GEN 1 */}
                            <ReferralTier
                                level={1}
                                active={gen1}
                                disabled={false}
                                color="orange"
                            >
                                <div className="relative w-28">
                                    <Input
                                        {...register("refGen1")}
                                        className="h-12 pr-10 rounded-xl border-slate-100 bg-slate-50 font-black text-right focus:bg-white"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-300 text-xs">৳</span>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    {!gen1 && <Lock size={14} className="text-slate-300 animate-pulse" />}
                                    <Switch
                                        // {...register("refGen1Switch")}
                                        checked={gen1}
                                        onCheckedChange={handelGen1}
                                        className={`scale-110 ${gen1 ? 'data-[state=checked]:bg-' + "orange" + '-600' : ''}`}
                                    />
                                </div>
                            </ReferralTier>

                            {/* GEN 2 */}
                            <ReferralTier
                                level={2}
                                active={gen2}
                                color="blue"
                                disabled={!gen1}
                            >
                                <div className="relative w-28">
                                    <Input
                                        {...register("refGen2")}
                                        className="h-12 pr-10 rounded-xl border-slate-100 bg-slate-50 font-black text-right focus:bg-white"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-300 text-xs">৳</span>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    {!gen1 && <Lock size={14} className="text-slate-300 animate-pulse" />}
                                    <Switch
                                        // {...register("refGen2Switch")}
                                        checked={gen2}
                                        onCheckedChange={handelGen2}
                                        disabled={!gen1}
                                        className={`scale-110 ${gen2 ? 'data-[state=checked]:bg-' + "blue" + '-600' : ''}`}
                                    />
                                </div>
                            </ReferralTier>

                            {/* GEN 3 */}
                            <ReferralTier
                                level={3}
                                active={gen3}
                                color="purple"
                                disabled={!gen2}
                            >
                                <div className="relative w-28">
                                    <Input
                                        {...register("refGen3")}
                                        className="h-12 pr-10 rounded-xl border-slate-100 bg-slate-50 font-black text-right focus:bg-white"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-300 text-xs">৳</span>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    {!gen2 && <Lock size={14} className="text-slate-300 animate-pulse" />}
                                    <Switch
                                        // {...register("refGen3Switch")}
                                        checked={gen3}
                                        onCheckedChange={setGen3}
                                        disabled={!gen2}
                                        className={`scale-110 ${gen3 ? 'data-[state=checked]:bg-' + "purple" + '-600' : ''}`}
                                    />
                                </div>
                            </ReferralTier>
                        </div>
                    </section>

                    {/* --- SECTION 3: PAYOUT LIMITS --- */}
                    <section className="space-y-4">
                        <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Payout Restrictions</h2>
                        <Card className="border-none rounded-[2.5rem] shadow-sm bg-white overflow-hidden">
                            <CardContent className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Withdrawal Fee (Flat)</Label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-300">%</span>
                                        <Input
                                            {...register("withdrawFee")}
                                            className="h-14 pl-10 rounded-2xl border-slate-100 bg-slate-50 font-black text-lg focus:bg-white focus:border-orange-500"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Min. Withdraw Limit</Label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-300">৳</span>
                                        <Input
                                            {...register("withdrawLimit")}
                                            className="h-14 pl-10 rounded-2xl border-slate-100 bg-slate-50 font-black text-lg focus:bg-white focus:border-orange-500"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    <section className="space-y-4 w-1/2">
                        <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Payout Restrictions</h2>
                        <Card className="border-none rounded-4xl transition-all duration-500 bg-white shadow-sm">
                            <CardContent className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="p-4 rounded-2xl bg-orange-600 text-white shadow-lg">
                                        <Dices size={22} />
                                    </div>
                                    <Input
                                        {...register("jobParRefresh")}
                                        className="h-14 pl-10 max-w-75 rounded-2xl border-slate-100 bg-slate-50 font-black text-lg focus:bg-white focus:border-orange-500"
                                    />
                                </div>
                                <h3 className="font-black text-slate-800 text-xl tracking-tight mb-1">Job limit par refresh</h3>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight leading-relaxed">Enable daily spin rewards for active users.</p>
                            </CardContent>
                        </Card>
                    </section>

                    {/* --- SAVE ACTION --- */}
                    <div className="bg-slate-900 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-slate-300">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-orange-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-orange-900/30">
                                <ShieldCheck size={32} />
                            </div>
                            <div className="text-left">
                                <h4 className="text-xl font-black text-white leading-none mb-1">Root Configuration</h4>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Authorized changes only</p>
                            </div>
                        </div>
                        <Button className="w-full md:w-auto min-w-65 h-16 bg-white hover:bg-orange-50 text-slate-900 rounded-2xl font-black text-xl flex gap-3 shadow-xl transition-all active:scale-95 group">
                            <Save size={24} className="text-orange-600 transition-transform group-hover:rotate-12" /> Apply Changes
                        </Button>
                    </div>

                </div>
            </form >
        </div >
    );
}

