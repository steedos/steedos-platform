import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  HttpStatus,
} from '@nestjs/common';

interface ErrorResponse {
  message: string;
  status: number;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private logger: Logger = new Logger(AllExceptionsFilter.name);
  catch(exception: any, host: ArgumentsHost) {
    try {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();

      this.logger.error(
        {
          method: request.method,
          url: request.url,
          headers: request.headers,
          exception,
        },
        exception.stack,
      );

      let errorResponse: ErrorResponse;
      const message =
        exception?.response?.error?.message ||
        exception?.response?.message ||
        exception.message;
      const code = exception?.response?.error?.code || exception?.code;

      if (exception instanceof HttpException) {
        errorResponse = {
          status: exception.getStatus(),
          message,
        };
      } else {
        errorResponse = {
          message,
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }

      response.status(errorResponse.status).json({
        statusCode: errorResponse.status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: errorResponse.message,
        code: code,
      });
    } catch (error) {
      this.logger.error(
        'Error while processing uncaught exception',
        error.stack,
      );
    }
  }
}
