import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';
import { ErrorCode } from '../constants/error-codes.constant';

export class DataSourceUnavailableError extends BaseException {
  readonly code = ErrorCode.DATA_SOURCE_UNAVAILABLE;
  readonly statusCode = HttpStatus.SERVICE_UNAVAILABLE;

  constructor(message: string, details?: Record<string, unknown>) {
    super(message, details);
  }
}
