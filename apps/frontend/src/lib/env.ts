const DEFAULT_API_URL = 'http://localhost:3001';

function getApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    return DEFAULT_API_URL;
  }

  try {
    new URL(url);
    return url;
  } catch {
    console.warn(`Invalid NEXT_PUBLIC_API_URL: ${url}, using default: ${DEFAULT_API_URL}`);
    return DEFAULT_API_URL;
  }
}

export const env = {
  NEXT_PUBLIC_API_URL: getApiUrl(),
};
