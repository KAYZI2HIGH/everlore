// The project id and dataset are public (they ship to the browser for Studio),
// so default them here; a deploy without Sanity env vars still builds.
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "90vaoe2q";
