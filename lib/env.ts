// Environment configuration helpers

/**
 * Determines if the application should use mock data instead of real database queries.
 * Driven by the NEXT_PUBLIC_USE_MOCK_DATA environment variable.
 */
export const isMockMode = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";
