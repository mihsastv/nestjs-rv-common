import {
  CallHandler,
  ExecutionContext,
  createParamDecorator,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { FORMAT_TEXT_MAP, Tags, Span, SpanContext } from 'opentracing';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TracerService } from './tracer.service';

export const Trace = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    if (ctx.getType() === 'http') {
      return ctx.switchToHttp().getRequest().span;
    } else if (ctx.getType() === 'rpc') {
      return ctx.switchToRpc().getContext().span;
    }
  },
);

@Injectable()
export class TracingInterceptor implements NestInterceptor<unknown, unknown> {
  constructor(private readonly tracer: TracerService) {}
  intercept(ctx: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> {
    let span: Span;

    if (ctx.getType() === 'rpc') {
      const rpcPayload = ctx.switchToRpc().getData();
      const rpcContext = ctx.switchToRpc().getContext();

      let parentSpanContext: SpanContext | undefined;
      if (rpcPayload?.spanContext) {
        parentSpanContext = this.tracer.extract(FORMAT_TEXT_MAP, rpcPayload.spanContext) ?? undefined;
        delete rpcPayload.spanContext;
      }

      span = this.tracer.startSpan(
        `${ctx.getClass().name}.${ctx.getHandler().name}`,
        {
          childOf: parentSpanContext,
        },
      );

      span.log({ payload: JSON.stringify(rpcPayload) });

      rpcContext.span = span;
    } else if (ctx.getType() === 'http') {
      const req = ctx.switchToHttp().getRequest();

      span = this.tracer.startSpan(
        `${ctx.getClass().name}.${ctx.getHandler().name}`, {
        tags: {
          [Tags.HTTP_METHOD]: req.method,
          [Tags.HTTP_URL]: req.url,
        },
      });

      req.span = span;
    }

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
