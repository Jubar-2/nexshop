import { Briefcase, Search } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function JobFinderCard() {
    return (

        < Card className="bg-white border-slate-100 shadow-sm rounded-2xl flex flex-col items-center justify-center p-8 text-center relative overflow-hidden" >
            <div className="absolute top-4 right-4">
                <Badge className="bg-emerald-500 text-white border-none rounded-lg px-3 py-1 font-bold">16 ACTIVE</Badge>
            </div>
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6">
                <Briefcase className="text-blue-600" size={40} />
            </div>
            <h3 className="text-4xl font-black text-slate-900 mb-2">16</h3>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">High-paying jobs are currently<br />available for your profile.</p>
            <Button className="w-full bg-[#10B981] hover:bg-[#0da06f] text-white rounded-xl h-14 font-black text-lg gap-3 shadow-lg">
                <Search size={20} />
                Browse All Jobs
            </Button>
        </Card >


    );
};

export default JobFinderCard;