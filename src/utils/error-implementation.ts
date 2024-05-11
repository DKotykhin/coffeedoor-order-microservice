import { RpcException } from '@nestjs/microservices';

export class ErrorImplementation extends RpcException {
  constructor({ message, code }: { message: string; code: number }) {
    super({ message, code });
  }

  public static unprocessableEntity(message = 'Unprocessable Entity') {
    return new ErrorImplementation({ message, code: 1 });
  }
  public static badRequest(message = 'Bad Request') {
    return new ErrorImplementation({ message, code: 3 });
  }
  public static gatewayTimeout(message = 'Gateway Timeout') {
    return new ErrorImplementation({ message, code: 4 });
  }
  public static notFound(message = 'Not Found') {
    return new ErrorImplementation({ message, code: 5 });
  }
  public static conflict(message = 'Conflict') {
    return new ErrorImplementation({ message, code: 6 });
  }
  public static forbidden(message = 'Forbidden') {
    return new ErrorImplementation({ message, code: 7 });
  }
  public static tooManyRequests(message = 'Too Many Requests') {
    return new ErrorImplementation({ message, code: 8 });
  }
  public static notImplemented(message = 'Not Implemented') {
    return new ErrorImplementation({ message, code: 12 });
  }
  public static internalServerError(message = 'Internal Server Error') {
    return new ErrorImplementation({
      message,
      code: 13,
    });
  }
  public static serviceUnavailable(message = 'Service Unavailable') {
    return new ErrorImplementation({
      message,
      code: 14,
    });
  }
  public static unauthorized(message = 'Unauthorized') {
    return new ErrorImplementation({ message, code: 16 });
  }
}
