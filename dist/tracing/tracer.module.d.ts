import { OnApplicationShutdown } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Tracer } from 'jaeger-client';
import { Span, SpanContext, SpanOptions } from 'opentracing';
export declare class TracerService extends Tracer implements Tracer {
    private readonly tracer;
    constructor();
    extract(format: string, carrier: unknown): SpanContext | null;
    inject(spanContext: SpanContext | Span, format: string, carrier: unknown): void;
    startSpan(name: string, options?: SpanOptions): Span;
    close(): void;
    protected _extract(format: string, carrier: unknown): SpanContext | null;
    protected _inject(spanContext: SpanContext, format: string, carrier: unknown): void;
    protected _startSpan(name: string, fields: SpanOptions): Span;
}
export declare class TracerModule implements OnApplicationShutdown {
    private readonly moduleRef;
    constructor(moduleRef: ModuleRef);
    onApplicationShutdown(): Promise<void>;
}
