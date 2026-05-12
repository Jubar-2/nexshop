import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Clock, Trash2 } from "lucide-react";
import { toast } from "sonner";

function SubCategoryDlt({ id }: { id: string }) {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({

        mutationFn: async (payload: string) => {
            const response = await axios.delete(
                "/api/admin/subcategory/delete",
                { data: { ids: [payload] } }
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["category"] });

            toast.success("Category Created", { description: ` is now live.` });


            toast.success("Withdrawal Request Sent", {
                description: `add is now pending review.`,
                icon: (
                    <div className="bg-emerald-50 p-1 rounded-lg">
                        <Clock className="text-emerald-500 w-4 h-4" />
                    </div>
                ),
            });

        },
        onError: (error: unknown) => {

            let message = "Something went wrong. Please try again.";

            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }

            toast.error("Withdrawal Failed", { description: message });
        },
    });

    function dlt() {
        mutate(id)
    }

    return (
        <Button
            disabled={isPending}
            onClick={dlt}
            size="icon" variant="ghost" className="h-8 w-8 text-slate-300 hover:text-red-500">
            {isPending ? (<Spinner />) : (<Trash2 size={14} />)}
        </Button>
    );
}

export default SubCategoryDlt;