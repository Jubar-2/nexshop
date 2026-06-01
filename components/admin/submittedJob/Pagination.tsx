import { Button } from "@/components/ui/button";
import { PaginationMeta } from "@/lib/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationType = {
    isLoading: boolean,
    setPage: React.Dispatch<React.SetStateAction<number>>,
    meta: PaginationMeta
}

function Pagination({ meta, isLoading, setPage }: PaginationType) {
    return (
        <div className="bg-white p-4 md:p-6 rounded-3xl md:rounded-3xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                Page {meta?.currentPage || 1} of {meta?.totalPages || 1}
            </p>
            <div className="flex gap-2 w-full sm:w-auto">
                <Button disabled={!meta?.hasPreviousPage || isLoading} onClick={() => setPage(p => p - 1)} variant="outline" className="flex-1 sm:flex-none rounded-xl font-bold h-10 px-4">
                    <ChevronLeft size={16} />
                </Button>
                <Button disabled={!meta?.hasNextPage || isLoading} onClick={() => setPage(p => p + 1)} variant="outline" className="flex-1 sm:flex-none rounded-xl font-bold h-10 px-4">
                    <ChevronRight size={16} />
                </Button>
            </div>
        </div>
    )
}

export default Pagination