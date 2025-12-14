type LogLevel = 'log' | 'warn' | 'error';

function sanitizeMessage(message: string): string {
  const secrets = [
    process.env.NEXT_PUBLIC_API_URL,
    process.env.API_KEY,
    process.env.AUTH_TOKEN,
  ].filter(Boolean);

  let sanitized = message;
  for (const secret of secrets) {
    if (secret) {
      sanitized = sanitized.replace(new RegExp(secret, 'gi'), '[REDACTED]');
    }
  }

  return sanitized;
}

function log(level: LogLevel, message: string, ...args: unknown[]): void {
  const sanitizedMessage = sanitizeMessage(message);
  const sanitizedArgs = args.map((arg) => {
    if (typeof arg === 'string') {
      return sanitizeMessage(arg);
    }
    return arg;
  });

  if (process.env.NODE_ENV === 'development') {
    console[level](sanitizedMessage, ...sanitizedArgs);
  } else if (level === 'error') {
    console.error(sanitizedMessage, ...sanitizedArgs);
  }
}

export const logger = {
  log: (message: string, ...args: unknown[]) => log('log', message, ...args),
  warn: (message: string, ...args: unknown[]) => log('warn', message, ...args),
  error: (message: string, ...args: unknown[]) => log('error', message, ...args),
};

