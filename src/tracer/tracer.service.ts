import { Injectable } from '@nestjs/common';
import { initTracerFromEnv, Tracer } from 'jaeger-client';
import { Span, SpanContext, SpanOptions } from 'opentracing';

@Injectable()
export class TracerService extends Tracer implements Tracer {
  private readonly tracer: Tracer;

  constructor() {
    super();

    if (!process.env.JAEGER_SERVICE_NAME) {
      process.env.JAEGER_SERVICE_NAME = 'assets';
    }

    this.tracer = initTracerFromEnv();
  }

  extract(format: string, carrier: unknown): SpanContext | null {
    return this.tracer.extract(format, carrier);
  }

  inject(
    spanContext: SpanContext | Span,
    format: string,
    carrier: unknown,
  ): void {
    return this.tracer.inject(spanContext, format, carrier);
  }

  startSpan(name: string, options?: SpanOptions): Span {
    return this.tracer.startSpan(name, options);
  }

  close() {
    this.tracer.close();
  }

  protected _extract(format: string, carrier: unknown): SpanContext | null {
    return this.tracer.extract(format, carrier);
  }

  protected _inject(
    spanContext: SpanContext,
    format: string,
    carrier: unknown,
  ): void {
    return this.tracer.inject(spanContext, format, carrier);
  }

  protected _startSpan(name: string, fields: SpanOptions): Span {
    return this.tracer.startSpan(name, fields);
  }
}
