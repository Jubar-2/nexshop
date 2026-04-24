/**
 * Metadata shape returned to the client.
 */
export interface PaginationMeta {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

/**
 * Highly Professional Pagination Handler.
 * Decoupled from the Request object to avoid type conflicts.
 */
export class Pagination {
    private readonly page: number;
    private readonly limit: number;
    private readonly maxLimit = 100;

    /**
     * Initializes pagination logic from search parameters.
     * 
     * @param {URLSearchParams} searchParams The search params from the request URL.
     * @param {number} defaultLimit Default items per page.
     */
    constructor(searchParams: URLSearchParams, defaultLimit: number = 10) {
        const parsedPage = parseInt(searchParams.get("page") || "1");
        const parsedLimit = parseInt(searchParams.get("limit") || defaultLimit.toString());

        // Sanitize: Page must be at least 1.
        this.page = Math.max(1, isNaN(parsedPage) ? 1 : parsedPage);

        // Sanitize: Limit must be between 1 and maxLimit.
        this.limit = Math.min(
            this.maxLimit,
            Math.max(1, isNaN(parsedLimit) ? defaultLimit : parsedLimit)
        );
    }

    /**
     * Returns configuration compatible with Prisma's findMany.
     */
    public get prismaOptions() {
        return {
            skip: (this.page - 1) * this.limit,
            take: this.limit,
        };
    }

    /**
     * Generates the metadata envelope for the API response.
     */
    public getMetadata(totalItems: number, currentItemCount: number): PaginationMeta {
        const totalPages = Math.ceil(totalItems / this.limit);

        return {
            totalItems,
            itemCount: currentItemCount,
            itemsPerPage: this.limit,
            totalPages,
            currentPage: this.page,
            hasNextPage: this.page < totalPages,
            hasPreviousPage: this.page > 1,
        };
    }
}