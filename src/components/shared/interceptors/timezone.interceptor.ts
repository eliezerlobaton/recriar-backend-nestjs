import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

export class TimezoneInterceptor implements NestInterceptor {
  static adjustDate(date: Date): Date {
    date.setHours(date.getHours() - 3);
    return date;
  }

  static iterateThroughObject(data: any, callback: any) {
    if (data === null) return;
    Object.values(data).forEach((value) => {
      if (typeof value === 'object' && !(value instanceof Date))
        return TimezoneInterceptor.iterateThroughObject(value, callback);
      if (value instanceof Date) value = callback(value);
    });
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        TimezoneInterceptor.iterateThroughObject(
          data,
          TimezoneInterceptor.adjustDate,
        );
        return data;
      }),
    );
  }
}
