function Step({ num, text }: { num: string, text: string }) {
    return (
        <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shadow-lg shrink-0">
                {num}
            </div>
            <p className="text-sm font-bold text-slate-700 leading-tight mt-1.5">{text}</p>
        </div>
    );
}

export default Step