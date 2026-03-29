import { 
  Wallet, Clock, TrendingUp, CheckCircle2, XCircle, 
  Briefcase, Search, Trophy, Medal, ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Dashboard = () => {
  return (
    <div className="p-6 bg-slate-50 min-h-screen font-poppins">
      
      {/* --- TOP SECTION: Earnings Header --- */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Earnings</h1>
        <div className="flex gap-3">
          <Button variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 h-10 px-4">
            View Statement
          </Button>
          <Button className="bg-[#10B981] hover:bg-[#0da06f] h-10 px-4 gap-2">
            <ExternalLink size={18} />
            Withdraw
          </Button>
        </div>
      </div>

      {/* --- MIDDLE SECTION: Balance Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Available Balance */}
        <Card className="border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <p className="text-slate-500 font-medium">Available Balance</p>
              <div className="p-2 bg-emerald-50 rounded-lg">
                <Wallet className="text-emerald-500" size={20} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-emerald-600">$0.00</h2>
          </CardContent>
        </Card>

        {/* Pending Earnings */}
        <Card className="border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <p className="text-slate-500 font-medium">Pending Earnings</p>
              <div className="p-2 bg-amber-50 rounded-lg">
                <Clock className="text-amber-500" size={20} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-amber-500">$0.00</h2>
          </CardContent>
        </Card>

        {/* Total Earned */}
        <Card className="border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <p className="text-slate-500 font-medium">Total Earned</p>
              <div className="p-2 bg-blue-50 rounded-lg">
                <TrendingUp className="text-blue-500" size={20} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-blue-600">$0.00</h2>
          </CardContent>
        </Card>
      </div>

      {/* --- BOTTOM SECTION: Info Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* My Submissions */}
        <Card className="border-none shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-700">My Submissions</CardTitle>
          </CardHeader>
          <CardContent className="grow space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-600">
                <Clock className="text-amber-500" size={20} />
                <span className="font-medium">Pending Review</span>
              </div>
              <Badge variant="secondary" className="bg-amber-50 text-amber-600 hover:bg-amber-50 rounded-md px-2.5">0</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-600">
                <CheckCircle2 className="text-emerald-500" size={20} />
                <span className="font-medium">Approved</span>
              </div>
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 rounded-md px-2.5">0</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-600">
                <XCircle className="text-red-500" size={20} />
                <span className="font-medium">Rejected</span>
              </div>
              <Badge variant="secondary" className="bg-red-50 text-red-600 hover:bg-red-50 rounded-md px-2.5">0</Badge>
            </div>
          </CardContent>
          <CardFooter className="pt-6 border-t border-slate-100">
            <Button variant="outline" size="sm" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">
              View All Submissions
            </Button>
          </CardFooter>
        </Card>

        {/* Available Jobs */}
        <Card className="border-none shadow-sm text-center">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold text-slate-700">Available Jobs</CardTitle>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100">16 Active</Badge>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="text-blue-500 mb-4" size={56} strokeWidth={1.5} />
            <h3 className="text-4xl font-black text-slate-800 mb-1">16</h3>
            <p className="text-slate-500 font-medium mb-8">jobs available for you</p>
            <Button className="bg-[#10B981] hover:bg-[#0da06f] rounded-lg px-8 gap-2">
              <Search size={18} />
              Browse All Jobs
            </Button>
          </CardContent>
        </Card>

        {/* Top Referrers */}
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-xl font-bold text-slate-700">Top Referrers</CardTitle>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100">Last 1 year</Badge>
          </CardHeader>
          <CardContent className="px-0">
            <div className="grid grid-cols-12 px-6 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <div className="col-span-2">Rank</div>
              <div className="col-span-7">User</div>
              <div className="col-span-3 text-right">Referrals</div>
            </div>
            <div className="divide-y divide-slate-50">
              {[
                { rank: 1, name: 'atb', count: 61, color: 'text-amber-500', icon: Trophy },
                { rank: 2, name: 'emonbhuiyan', count: 32, color: 'text-slate-400', icon: Medal },
                { rank: 3, name: 'biplob_2004', count: 15, color: 'text-amber-700', icon: Medal },
                { rank: 4, name: 'Joynul', count: 8 },
                { rank: 5, name: 'munna14447', count: 5 }
              ].map((item, i) => (
                <div key={i} className="grid grid-cols-12 items-center px-6 py-3 hover:bg-slate-50/50 transition-colors">
                  <div className="col-span-2">
                    {item.icon ? (
                      <item.icon size={18} className={item.color} />
                    ) : (
                      <span className="font-bold text-slate-400 text-sm ml-1">{item.rank}</span>
                    )}
                  </div>
                  <div className="col-span-7 flex items-center gap-3">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className={`bg-emerald-100 text-emerald-700 font-bold text-xs`}>
                        {item.name[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-slate-700 text-sm">{item.name}</span>
                  </div>
                  <div className="col-span-3 text-right font-bold text-emerald-600">{item.count}</div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-400 italic">You have no referrals yet</p>
          </CardFooter>
        </Card>

      </div>
    </div>
  );
};

export default Dashboard;