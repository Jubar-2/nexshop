"use client"

import Navigation from "@/components/worker/dashboard/Navigation";
import UpgradePromo from '@/components/worker/dashboard/UpgradePromo';
import EarningsStats from '@/components/worker/dashboard/EarningsStats';
import MembershipCard from '@/components/worker/dashboard/MembershipCard';
import JobFinderCard from '@/components/worker/dashboard/JobFinderCard';
import ReferrersLeaderboard from '@/components/worker/dashboard/ReferrersLeaderboard';
import SubmissionsStats from '@/components/worker/dashboard/SubmissionsStats';


const ProfessionalDashboard = () => {
  return (
    <div className="p-4 md:p-8 bg-[#F0F2F5] min-h-screen font-poppins mt-14">

      <Navigation />

      <div className="max-w-7xl mx-auto space-y-8">

        {/* --- UPGRADE PROMO SECTION --- */}
        <UpgradePromo />


        {/* --- EARNINGS STATS GRID --- */}
        <EarningsStats />

        {/* --- SUBMISSIONS STATS GRID --- */}
        <SubmissionsStats />

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Membership Card */}
          <MembershipCard />

          {/* Job Finder Card */}
          <JobFinderCard />

          {/* Referrers Leaderboard */}
          <ReferrersLeaderboard />
        </div>

      </div>
    </div>
  );
};



export default ProfessionalDashboard;