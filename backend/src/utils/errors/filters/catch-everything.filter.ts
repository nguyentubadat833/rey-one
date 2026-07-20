import { AppError } from '@/utils/errors/app.error';
import { ErrorKey, ApiErrorResponse, ApiError } from '@rey-one/shared';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { DriverException, UniqueConstraintViolationException } from '@mikro-orm/core';

@Catch()
export class AppCatchEverythingFilter implements ExceptionFilter {
  private readonly logger = new Logger(AppCatchEverythingFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const error = this.handleError(exception);

    if (error.statusCode === Number(HttpStatus.INTERNAL_SERVER_ERROR)) {
      this.logger.error(`[500] ${error.message}`, exception instanceof Error ? exception.stack : String(exception));
    }

    const responseData: ApiErrorResponse = {
      error: {
        statusCode: error.statusCode,
        message: error.message,
        errorKey: error.errorKey,
      },
      meta: {
        time: new Date().toISOString(),
        path: httpAdapter.getRequestUrl(ctx.getRequest()) as string,
      },
    };

    httpAdapter.reply(ctx.getResponse(), responseData, error.statusCode);
  }

  private handleError(error: unknown): ApiError {
    if (error instanceof AppError) {
      const statusCode = AppErrorHttpStatus[error.type] ?? HttpStatus.INTERNAL_SERVER_ERROR;

      let message = error.message;
      if (!message || !message.length) {
        message = error.type;
      }

      const errorKey = error.type;

      return { statusCode, message, errorKey };
    }

    if (error instanceof HttpException) {
      return { statusCode: error.getStatus(), message: error.message };
    }

    if (error instanceof DriverException) {
      console.log(JSON.stringify(error))
      const statusCode = MikroErrorHttpStatus[error.name];
      return {
        statusCode: statusCode ?? 500,
        message: `Database Error: ${error.name}`,
      };
    }
    // console.log(JSON.stringify(error))

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    };
  }
}

const MikroErrorHttpStatus: Record<string, HttpStatus> = {
  [UniqueConstraintViolationException.name]: HttpStatus.CONFLICT,
};

const AppErrorHttpStatus: Record<ErrorKey, HttpStatus> = {
  UNKNOWN_ERROR: HttpStatus.INTERNAL_SERVER_ERROR,
  USER_PERMISSIONS_EXCEED_GROUP: HttpStatus.BAD_REQUEST,
  PASSWORD_HASHED_NOT_FOUND: HttpStatus.NOT_FOUND
};

// const AppErrorHttpStatus: Record<ErrorType, HttpStatus> = {
//     // -------------------------
//     // 400 Bad Request
//     // ------------------------->
//     INVALID_EMAIL: HttpStatus.BAD_REQUEST,
//     INVALID_PASSWORD: HttpStatus.BAD_REQUEST,
//     INVALID_USERNAME: HttpStatus.BAD_REQUEST,
//     INVALID_USER_STATUS: HttpStatus.BAD_REQUEST,
//     INVALID_USER_STATUS_TRANSITION: HttpStatus.BAD_REQUEST,
//     INVALID_PROVIDER_ID: HttpStatus.BAD_REQUEST,
//     INVALID_PRODUCT_STATUS: HttpStatus.BAD_REQUEST,
//     INVALID_PRODUCT_STATUS_TRANSITION: HttpStatus.BAD_REQUEST,
//     MONEY_AMOUNT_NEGATIVE: HttpStatus.BAD_REQUEST,
//     MONEY_CURRENCY_MISMATCH: HttpStatus.BAD_REQUEST,
//     MONEY_INVALID_FACTOR: HttpStatus.BAD_REQUEST,
//     ORDER_EMPTY: HttpStatus.BAD_REQUEST,
//     ORDER_INVALID_STATUS: HttpStatus.BAD_REQUEST,
//     PAYMENT_COMPLETE_INVALID_STATUS: HttpStatus.BAD_REQUEST,
//     PAYMENT_FAIL_INVALID_STATUS: HttpStatus.BAD_REQUEST,
//     PAYMENT_REFUND_INVALID_STATUS: HttpStatus.BAD_REQUEST,
//     PAYMENT_INVALID_WEBHOOK_SIGNATURE: HttpStatus.BAD_REQUEST,
//     USER_TYPE_UNSUPPORTED: HttpStatus.BAD_REQUEST,

//     // -------------------------
//     // 401 Unauthorized
//     // -------------------------
//     AUTH_INVALID_CREDENTIALS: HttpStatus.UNAUTHORIZED,
//     TOKEN_VERIFICATION_FAILED: HttpStatus.UNAUTHORIZED,
//     PASSWORD_VERIFICATION_FAILED: HttpStatus.UNAUTHORIZED,

//     // -------------------------
//     // 403 Forbidden
//     // -------------------------
//     USER_BANNED: HttpStatus.FORBIDDEN,
//     USER_NOT_LOCAL_ACCOUNT: HttpStatus.FORBIDDEN,
//     PERMISSION_DISABLED: HttpStatus.FORBIDDEN,
//     PRODUCT_NOT_SELLABLE: HttpStatus.FORBIDDEN,
//     ORDER_NOT_ACCESSIBLE: HttpStatus.FORBIDDEN, // 403, not 409 — user lacks access rights

//     // -------------------------
//     // 404 Not Found
//     // -------------------------
//     USER_NOT_FOUND: HttpStatus.NOT_FOUND,
//     ROLE_NOT_FOUND: HttpStatus.NOT_FOUND,
//     PERMISSION_NOT_FOUND: HttpStatus.NOT_FOUND,
//     PRODUCT_NOT_FOUND: HttpStatus.NOT_FOUND,
//     PRODUCT_PRICING_NOT_FOUND: HttpStatus.NOT_FOUND,
//     ORDER_NOT_FOUND: HttpStatus.NOT_FOUND,
//     PAYMENT_NOT_FOUND: HttpStatus.NOT_FOUND,

//     // -------------------------
//     // 409 Conflict
//     // -------------------------
//     EMAIL_ALREADY_EXISTS: HttpStatus.CONFLICT,
//     EMAIL_ALREADY_VERIFIED: HttpStatus.CONFLICT,
//     USER_ALREADY_EXISTS: HttpStatus.CONFLICT,
//     USER_ALREADY_VERIFIED: HttpStatus.CONFLICT,
//     ROLE_ALREADY_EXISTS: HttpStatus.CONFLICT,
//     PRODUCT_ALREADY_IN_CART: HttpStatus.CONFLICT,
//     ORDER_ALREADY_PAID: HttpStatus.CONFLICT,
//     ORDER_NOT_CANCELLABLE: HttpStatus.CONFLICT,
//     ORDER_NOT_COUPON_APPLICABLE: HttpStatus.CONFLICT,
//     ORDER_NOT_REFUNDABLE: HttpStatus.CONFLICT,

//     // -------------------------
//     // 429 Too Many Requests
//     // -------------------------
//     AUTH_MAX_ATTEMPTS_EXCEEDED: HttpStatus.TOO_MANY_REQUESTS,

//     // -------------------------
//     // 500 Internal Server Error
//     // -------------------------
//     DATABASE_PROBLEM: HttpStatus.INTERNAL_SERVER_ERROR,
//     EMAIL_VERIFICATION_DISABLED: HttpStatus.INTERNAL_SERVER_ERROR,
//     ORDER_DISCOUNT_FAILED: HttpStatus.INTERNAL_SERVER_ERROR,
//     TOKEN_GENERATION_FAILED: HttpStatus.INTERNAL_SERVER_ERROR,
//     PASSWORD_HASH_FAILED: HttpStatus.INTERNAL_SERVER_ERROR,
//     PRODUCT_PRICING_FAILED: HttpStatus.INTERNAL_SERVER_ERROR,
//     ORDER_PRICING_FAILED: HttpStatus.INTERNAL_SERVER_ERROR,
//     PAYMENT_GATEWAY_ERROR: HttpStatus.INTERNAL_SERVER_ERROR,
// };
