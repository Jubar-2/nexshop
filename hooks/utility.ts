import { formatDistanceToNow } from "date-fns";

export function formatJobTime(date: string | Date) {
    return formatDistanceToNow(new Date(date), {
        addSuffix: false,
    });
}