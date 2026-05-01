
export default function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <div className={`flex items-center gap-3 py-2 cursor-pointer transition-colors group`}>
            <span className={`${active ? 'text-[#10B981]' : 'text-slate-400'} group-hover:text-[#10B981]`}>
                {icon}
            </span>
            <span className={`text-[15px] font-medium ${active ? 'text-[#10B981]' : 'text-slate-500'} group-hover:text-[#10B981]`}>
                {label}
            </span>
        </div>
    )
}