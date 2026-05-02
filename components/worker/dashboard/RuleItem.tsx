const RuleItem = ({ text }: { text: string }) => (
    <li className="flex items-center gap-3 text-xs font-bold text-slate-500">
        <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
        {text}
    </li>
);

export default RuleItem