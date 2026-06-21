import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";


export default function layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Providers>{children}</Providers>
            <Toaster />
        </>
    );
}