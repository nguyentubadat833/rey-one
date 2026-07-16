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
  // --
  SUPER_ADMIN_USER_CANNOT_BE_CHANGED: HttpStatus.FORBIDDEN,
  SUPER_ADMIN_ROLE_CANNOT_BE_DISABLED: HttpStatus.FORBIDDEN,
  INSUFFICIENT_ROLE: HttpStatus.FORBIDDEN,
  INSUFFICIENT_PERMISSION: HttpStatus.FORBIDDEN,
  //--
  USER_PASSWORD_NOT_SET: HttpStatus.BAD_REQUEST,
  USER_NOT_FOUND: HttpStatus.NOT_FOUND,
  USERNAME_ALREADY_EXISTS: HttpStatus.CONFLICT,
  INVALID_USER_STATUS_TRANSITION: HttpStatus.CONFLICT,
  INVALID_CREDENTIAL_PASSWORD: HttpStatus.UNAUTHORIZED,
  PASSWORD_HASH_FAILED: HttpStatus.INTERNAL_SERVER_ERROR,
  PASSWORD_VERIFICATION_FAILED: HttpStatus.INTERNAL_SERVER_ERROR,
  EMAIL_ALREADY_USED: HttpStatus.CONFLICT,
  OAUTH_ACCOUNT_CANNOT_CHANGE_PASSWORD: HttpStatus.BAD_REQUEST,
  // --
  TOKEN_NOT_FOUND: HttpStatus.UNAUTHORIZED,
  REFRESH_TOKEN_NOT_FOUND: HttpStatus.UNAUTHORIZED,
  VERIFY_TOKEN_FAILED: HttpStatus.UNAUTHORIZED,
  INVALID_TOKEN_PAYLOAD: HttpStatus.UNAUTHORIZED,
  INVALID_USER_STATUS: HttpStatus.UNAUTHORIZED,
  VERIFY_REFRESH_TOKEN_FAILED: HttpStatus.UNAUTHORIZED,
  INVALID_REFRESH_TOKEN_PAYLOAD: HttpStatus.UNAUTHORIZED,
  VERIFY_REAUTH_TOKEN_FAILED: HttpStatus.FORBIDDEN,
  INVALID_REAUTH_TOKEN_PAYLOAD: HttpStatus.FORBIDDEN,
  // --
  INVALID_ORGANIZATION_STATUS: HttpStatus.CONFLICT,
  INVALID_MEMBERSHIP_ROLE_STATUS: HttpStatus.CONFLICT,
  ORGANIZATION_TAXCODE_ALREADY_EXISTS: HttpStatus.CONFLICT,
  ORGANIZATION_ACCESS_DENIED: HttpStatus.FORBIDDEN,
  ORGANIZATION_PERMISSION_DENIED: HttpStatus.FORBIDDEN,
  ORGANIZATION_NOT_FOUND: HttpStatus.NOT_FOUND,
  ORGANIZATION_PERMISSION_NOT_FOUND: HttpStatus.NOT_FOUND,
  ORGANIZATION_BRANCH_NOT_FOUND: HttpStatus.NOT_FOUND,
  ORGANIZATION_INVALID_BRANCH_STATUS: HttpStatus.CONFLICT,
  ORGANIZATION_ROLE_NOT_FOUND: HttpStatus.NOT_FOUND,
  MEMBERSHIP_ROLE_NOT_FOUND: HttpStatus.NOT_FOUND,
  MEMBERSHIP_ROLE_ALREADY_EXISTS: HttpStatus.CONFLICT,
  MEMBERSHIP_NOT_FOUND: HttpStatus.NOT_FOUND,
  // --
  PRODUCT_NOT_FOUND: HttpStatus.NOT_FOUND,
  PRODUCT_IMAGE_NOT_FOUND: HttpStatus.NOT_FOUND,
  PRODUCT_IMAGE_CANNOT_BE_PRIMARY_WHEN_INACTIVE: HttpStatus.CONFLICT,
  PRODUCT_IMAGE_PRIMARY_CANNOT_BE_DEACTIVATED: HttpStatus.CONFLICT,
  PRODUCT_IMAGE_PRIMARY_CANNOT_BE_REMOVED: HttpStatus.CONFLICT,
  PRODUCT_IMAGE_REORDER_INVALID: HttpStatus.BAD_REQUEST,
  INVALID_PRODUCT_STATUS: HttpStatus.CONFLICT,
  INVALID_PRODUCT_STATUS_TRANSITION: HttpStatus.CONFLICT,
  //--
  CART_ITEM_NOT_FOUND: HttpStatus.NOT_FOUND,
  CART_ITEM_ACCESS_DENIED: HttpStatus.FORBIDDEN,
  //--
  COURSE_NOT_FOUND: HttpStatus.NOT_FOUND,
  CHAPTER_NOT_FOUND: HttpStatus.NOT_FOUND,
  LECTURE_NOT_FOUND: HttpStatus.NOT_FOUND,
  LECTURE_RESOURCE_NOT_FOUND: HttpStatus.NOT_FOUND,
  LECTURE_RESOURCE_FILE_MISSING: HttpStatus.NOT_FOUND,
  COURSE_ARCHIVED: HttpStatus.CONFLICT,
  CHAPTER_HAS_LECTURES: HttpStatus.CONFLICT,
  LECTURE_ALREADY_HAS_CONTENT: HttpStatus.CONFLICT,
  ENROLLMENT_NOT_FOUND: HttpStatus.NOT_FOUND,
  COURSE_HAS_ENROLLMENTS: HttpStatus.CONFLICT,
  COURSE_HAS_ACTIVE_ENROLLMENTS: HttpStatus.CONFLICT,
  //--
  STORAGE_FILE_NOT_FOUND: HttpStatus.NOT_FOUND,
  STORAGE_OPERATION_FAILED: HttpStatus.INTERNAL_SERVER_ERROR,
  STORAGE_PRESIGNED_REQUEST_NOT_FOUND: HttpStatus.NOT_FOUND,
  STORAGE_OBJECT_NOT_FOUND: HttpStatus.NOT_FOUND,
  INVALID_S3_STORAGE_METADATA: HttpStatus.UNPROCESSABLE_ENTITY,
  INVALID_S3_STORAGE_METADATA_WITH_ENCODE: HttpStatus.UNPROCESSABLE_ENTITY,
  UNSUPPORTED_LECTURE_RESOURCE_TYPE: HttpStatus.BAD_REQUEST,
  UNSUPPORTED_STORAGE_PROVIDER: HttpStatus.BAD_REQUEST,
  FILE_SOFT_DELETED: HttpStatus.BAD_REQUEST,
  MULTIPLE_STORAGE_BUCKETS_NOT_SUPPORTED: HttpStatus.BAD_REQUEST,
  // --
  ORDER_NOT_FOUND: HttpStatus.NOT_FOUND,
  ORDER_ITEM_NOT_FOUND: HttpStatus.NOT_FOUND,
  ORDER_CANNOT_BE_CANCELLED: HttpStatus.CONFLICT,
  ORDER_CANNOT_BE_UPDATED: HttpStatus.CONFLICT,
  ORDER_MUST_HAVE_AT_LEAST_ONE_PRODUCT: HttpStatus.BAD_REQUEST,
  ORDER_ITEMS_MUST_BE_SAME_TYPE: HttpStatus.BAD_REQUEST,
  ORDER_CANNOT_BE_MARKED_AS_PAID: HttpStatus.CONFLICT,
  ORDER_CANNOT_BE_PAID: HttpStatus.BAD_REQUEST,
  ORDER_STATUS_MUST_BE_PENDING: HttpStatus.CONFLICT,
  // --
  PROMOTION_NOT_FOUND: HttpStatus.NOT_FOUND,
  PROMOTION_ALL_ALREADY_EXISTS: HttpStatus.CONFLICT,
  PROMOTION_TARGET_TYPE_CANNOT_BE_CHANGED: HttpStatus.CONFLICT,
  PROMOTION_ALREADY_EXPIRED: HttpStatus.CONFLICT,
  PROMOTION_STARTS_AT_IN_PAST: HttpStatus.CONFLICT,
  PROMOTION_ENDS_AT_NOT_IN_FUTURE: HttpStatus.CONFLICT,
  PROMOTION_STARTS_AT_CANNOT_BE_CHANGED: HttpStatus.CONFLICT,
  PROMOTION_ENDS_AT_MUST_BE_AFTER_STARTS_AT: HttpStatus.CONFLICT,
  // --
  PAYMENT_NOT_FOUND: HttpStatus.NOT_FOUND,
  PAYMENT_METHOD_NOT_SUPPORTED: HttpStatus.BAD_REQUEST,
  PAYMENT_CANNOT_BE_SUCCESS: HttpStatus.CONFLICT,
  SEPAY_UNSUPPORTED_CURRENCY: HttpStatus.BAD_REQUEST,
  SEPAY_BANK_TRANSFER_CANCEL_ERROR: HttpStatus.INTERNAL_SERVER_ERROR,
  SEPAY_PAYMENT_METHOD_REQUIRED: HttpStatus.CONFLICT,
  CASH_PAYMENT_METHOD_REQUIRED: HttpStatus.CONFLICT,
  //--
  END_DATE_MUST_BE_IN_THE_FUTURE: HttpStatus.BAD_REQUEST,
  PRODUCT_PRICE_NOT_FOUND: HttpStatus.NOT_FOUND,
  PRODUCT_ALREADY_HAS_PROMOTION: HttpStatus.CONFLICT,
  PRODUCT_ALREADY_HAS_SPECIFIC_PROMOTION: HttpStatus.CONFLICT,
  SOME_PRODUCTS_NOT_FOUND_OR_INACTIVE: HttpStatus.BAD_REQUEST,
  // --
  UNSUPPORTED_CURRENCY_PAIR: HttpStatus.UNPROCESSABLE_ENTITY,
  PAYMENT_AMOUNT_MISMATCH: HttpStatus.CONFLICT,
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
