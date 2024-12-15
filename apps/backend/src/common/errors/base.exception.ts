import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../constants/error-codes.constant';

export abstract class BaseException extends Error {
  abstract readonly code: ErrorCode;
  abstract readonly statusCode: HttpStatus;
  readonly timestamp: string;
  readonly requestId?: string;

  constructor(
    message: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.timestamp = new Date().toISOString();
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  setRequestId(requestId: string): void {
    (this as { requestId: string }).requestId = requestId;
  }
}
