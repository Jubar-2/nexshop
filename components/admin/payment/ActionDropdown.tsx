import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ExternalLink, MoreHorizontal, ShieldCheck } from "lucide-react";

const ActionDropdown = () => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-400 hover:bg-white">
                <MoreHorizontal size={20} />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 rounded-xl font-poppins">
            <DropdownMenuItem className="gap-2 font-bold text-slate-600"><ExternalLink size={16} /> View Profile</DropdownMenuItem>
            <DropdownMenuItem className="gap-2 font-bold text-slate-600"><ShieldCheck size={16} /> Mark Fraud</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
);

export default ActionDropdown;