import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { RequestWithId } from '../middleware/request-id.middleware';
import { BaseException } from '../errors/base.exception';
import { ErrorCode } from '../constants/error-codes.constant';
import { ErrorResponseDto } from '../dto/error-response.dto';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<RequestWithId>();

    const errorResponse = this.formatError(exception, request);

    this.logError(exception, request, errorResponse);

    response.status(errorResponse.statusCode).json({
      error: {
        code: errorResponse.code,
        message: errorResponse.message,
        details: errorResponse.details,
        timestamp: errorResponse.timestamp,
        requestId: errorResponse.requestId,
      },
    });
  }

  private formatError(
    exception: unknown,
    request: RequestWithId
  ): ErrorResponseDto & { statusCode: number } {
    const requestId = request.id || 'unknown';

    if (exception instanceof BaseException) {
      if (!exception.requestId) {
        exception.setRequestId(requestId);
      }

      return {
        code: exception.code,
        message: exception.message,
        details: exception.details,
        timestamp: exception.timestamp,
        requestId: exception.requestId || requestId,
        statusCode: exception.statusCode,
      };
    }

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      let message: string;
      let details: Record<string, unknown> | undefined;

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message = (responseObj.message as string) || exception.message;
        details = responseObj as Record<string, unknown>;
      } else {
        message = exception.message;
      }

      return {
        code: this.mapHttpStatusToErrorCode(statusCode),
        message,
        details,
        timestamp: new Date().toISOString(),
        requestId,
        statusCode,
      };
    }

    const error = exception instanceof Error ? exception : new Error('Unknown error');
    const errorMessage = error.message || 'An unexpected error occurred';

    return {
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      message: errorMessage,
      timestamp: new Date().toISOString(),
      requestId,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }

  private mapHttpStatusToErrorCode(statusCode: number): ErrorCode {
    if (statusCode >= 400 && statusCode < 500) {
      if (statusCode === HttpStatus.NOT_FOUND) {
        return ErrorCode.RESOURCE_NOT_FOUND;
      }
      if (statusCode === HttpStatus.BAD_REQUEST) {
        return ErrorCode.VALIDATION_ERROR;
      }
      return ErrorCode.INVALID_INPUT;
    }

    if (statusCode === HttpStatus.SERVICE_UNAVAILABLE) {
      return ErrorCode.DATA_SOURCE_UNAVAILABLE;
    }

    return ErrorCode.INTERNAL_SERVER_ERROR;
  }

  private logError(
    exception: unknown,
    request: RequestWithId,
    errorResponse: ErrorResponseDto & { statusCode: number }
  ): void {
    const logContext = {
      error: {
        code: errorResponse.code,
        message: errorResponse.message,
        statusCode: errorResponse.statusCode,
      },
      request: {
        id: errorResponse.requestId,
        method: request.method,
        url: request.url,
        ip: request.ip,
      },
      stack: exception instanceof Error ? exception.stack : undefined,
    };

    if (errorResponse.statusCode >= 500) {
      this.logger.error(logContext);
    } else {
      this.logger.warn(logContext);
    }
  }
}
