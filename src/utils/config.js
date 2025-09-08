// Configuration file for environment variables

export const config = {
  apiBaseUrl: process.env.API_BASE_URL || "https://around-api.en.tripleten-services.com/v1",
  apiToken: process.env.API_TOKEN || "f1f1dbab-8e17-48d3-a098-d77dfd6ea3c5", // fallback for development
};