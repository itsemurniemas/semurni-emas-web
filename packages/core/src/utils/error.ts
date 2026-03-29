export const parseApiError = (error: unknown): string => {
    if (error instanceof Error) {
        try {
            const parsed = JSON.parse(error.message);
            return parsed.message || "An unexpected error occurred.";
        } catch {
            return error.message;
        }
    }
    return typeof error === "string" ? error : "An unexpected error occurred.";
};
