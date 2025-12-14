export class ErrorResponseDto {
  code!: string;
  message!: string;
  statusCode!: number;
  timestamp!: string;
  requestId!: string;
  details?: unknown;
}
