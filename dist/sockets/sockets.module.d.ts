import * as Hemera from 'nats-hemera';
import { Span } from 'opentracing';
import { Logger } from '../logger/logger.module';
import { TracerService } from '../tracer/tracer.module';
export declare type SocketData = Record<string, unknown>;
export declare class SocketsService {
    private readonly hemera;
    private readonly logger;
    private readonly tracer;
    constructor(hemera: Hemera<{}, {}>, logger: Logger, tracer: TracerService);
    message(span: Span, data: SocketData): any;
    message(span: Span, channel: string, data: SocketData): any;
    private messageWithOptionalRootEventName;
}
export declare class SocketsModule {
}
