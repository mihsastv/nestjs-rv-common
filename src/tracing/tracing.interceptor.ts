import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { FORMAT_TEXT_MAP, SpanContext } from 'opentracing';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TracerService } from './tracer.module';

@Injectable()
export class TracingInterceptor implements NestInterceptor {
  constructor(private readonly tracer: TracerService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const args = context.getArgs();
    let parentSpanContext: SpanContext | undefined;

    if (args.length) {
      const [payload] = args;
      const spanContext = payload && payload.spanContext;
      parentSpanContext =
        this.tracer.extract(FORMAT_TEXT_MAP, spanContext) || undefined;
    }

    const span = this.tracer.startSpan(
      `${context.getClass().name}.${context.getHandler().name}`,
      {
        childOf: parentSpanContext,
      },
    );

    span.log({ arguments: JSON.stringify(args) });
    args.push(span);

    return next.handle().pipe(
      tap(
        () => span.finish(),
        err => {
          span.setTag('error', true);
          span.setTag('error.message', err.error && err.error.message);
          span.log({ stack: err.error && err.error.stack });
          span.finish();
          return err;
        },
      ),
    );
  }
}
