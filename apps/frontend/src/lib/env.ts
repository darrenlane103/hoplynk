function getApiUrl(): string {
  const serverUrl = process.env.API_URL;
  const publicUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = serverUrl || publicUrl;
  
  if (!url) {
    if (typeof window === 'undefined') {
      throw new Error('API_URL or NEXT_PUBLIC_API_URL environment variable must be set for server-side requests');
    }
    throw new Error('NEXT_PUBLIC_API_URL must be configured');
  }

  try {
    new URL(url);
    return url;
  } catch {
    throw new Error(`Invalid API URL: ${url}`);
  }
}

function getPublicApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    throw new Error('NEXT_PUBLIC_API_URL environment variable must be set');
  }

  try {
    new URL(url);
    return url;
  } catch {
    throw new Error(`Invalid NEXT_PUBLIC_API_URL: ${url}`);
  }
}

export const env = {
  API_URL: getApiUrl(),
  NEXT_PUBLIC_API_URL: getPublicApiUrl(),
};
