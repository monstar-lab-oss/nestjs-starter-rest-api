import { HttpException } from '@nestjs/common';

export class BaseApiException extends HttpException {
  public localizedMessage: Record<string, string> | undefined;
  public details: string | Record<string, any> | undefined;

  constructor(
    message: string,
    status: number,
    details?: string | Record<string, any>,
    localizedMessage?: Record<string, string>,
  ) {
    // Calling parent constructor of base Exception class.
    super(message, status);
    this.name = BaseApiException.name;
    this.localizedMessage = localizedMessage;
    this.details = details;
  }
}
