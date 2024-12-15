type HttpErrorCode = 'NETWORK_ERROR' | 'TIMEOUT_ERROR' | 'HTTP_ERROR' | 'PARSE_ERROR' | 'UNKNOWN_ERROR';

export class HttpError extends Error {
  constructor(
    message: string,
    public readonly code: HttpErrorCode,
    public readonly status?: number,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'HttpError';
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

type FetchOptions = RequestInit & {
  timeout?: number;
  retries?: number;
};

const DEFAULT_TIMEOUT = 10000;
const DEFAULT_RETRIES = 0;

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function httpFetch<T>(
  url: string,
  options: FetchOptions = {},
): Promise<T> {
  const { timeout = DEFAULT_TIMEOUT, retries = DEFAULT_RETRIES, ...fetchOptions } = options;

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const status = response.status;
        let message = `HTTP ${status} ${response.statusText}`;

        if (status === 0 || status >= 500) {
          message = 'Server is unavailable. Please check if the backend service is running.';
        } else if (status >= 400) {
          message = `Request failed: ${response.statusText}`;
        }

        throw new HttpError(message, 'HTTP_ERROR', status);
      }

      try {
        return await response.json();
      } catch (parseError) {
        throw new HttpError(
          'Failed to parse response as JSON',
          'PARSE_ERROR',
          response.status,
          parseError,
        );
      }
    } catch (error) {
      lastError = error;

      if (error instanceof HttpError) {
        if (error.code === 'HTTP_ERROR' && error.status && error.status >= 500 && attempt < retries) {
          await sleep(1000 * (attempt + 1));
          continue;
        }
        throw error;
      }

      if (error instanceof TypeError && (error.message.includes('fetch') || error.message.includes('Failed to fetch'))) {
        if (attempt < retries) {
          await sleep(1000 * (attempt + 1));
          continue;
        }
        throw new HttpError(
          `Cannot connect to server at ${url}`,
          'NETWORK_ERROR',
          undefined,
          error,
        );
      }

      if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('aborted'))) {
        throw new HttpError(
          `Request timed out after ${timeout}ms`,
          'TIMEOUT_ERROR',
          undefined,
          error,
        );
      }

      if (attempt < retries) {
        await sleep(1000 * (attempt + 1));
        continue;
      }

      throw new HttpError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        'UNKNOWN_ERROR',
        undefined,
        error,
      );
    }
  }

  throw lastError instanceof HttpError
    ? lastError
    : new HttpError('Request failed after retries', 'UNKNOWN_ERROR', undefined, lastError);
}

