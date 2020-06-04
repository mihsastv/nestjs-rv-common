import * as Hemera from 'nats-hemera';
import { Span } from 'opentracing';
import { Logger } from '../logger/logger.module';
import { TracerService } from '../tracer/tracer.module';
export declare class LogsService {
    private readonly hemera;
    private readonly logger;
    private readonly tracer;
    constructor(hemera: Hemera<{}, {}>, logger: Logger, tracer: TracerService);
    push(span: Span, payload: Record<string, unknown>): void;
}
export declare class LogsModule {
}
