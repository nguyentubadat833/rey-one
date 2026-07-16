import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { ApiResponse } from '@rey-one/shared';
import { Observable, map } from "rxjs";

@Injectable()
export class ResponseConfig<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map(
        (data): ApiResponse<T> => ({
          data,
          meta: {
            time: new Date().toISOString(),
            path: request.originalUrl,
          },
        }),
      ),
    );
  }
}
