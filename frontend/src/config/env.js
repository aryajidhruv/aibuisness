const required = {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
};

const missing = Object.entries(required)
  .filter(([, value]) => !value?.trim())
  .map(([key]) => key);

if (missing.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missing.join(', ')}\n` +
      'Copy frontend/.env.example to frontend/.env and fill in the values.'
  );
}

export const env = required;
