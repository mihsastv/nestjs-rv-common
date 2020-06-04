import * as Hemera from 'nats-hemera';
import { Span } from 'opentracing';
import { Logger } from '../logger/logger.module';
import { TracerService } from '../tracer/tracer.module';
export interface NotificatorServicePushPayload {
    actorId?: number;
    assetsIds?: number[];
    channelId?: string;
    companyId: number;
    data: unknown;
    deviceId?: number;
    networksIds?: number[];
    softwareId?: number;
    type: string;
}
export declare class NotificatorService {
    private readonly hemera;
    private readonly logger;
    private readonly tracer;
    constructor(hemera: Hemera<{}, {}>, logger: Logger, tracer: TracerService);
    commit(span: Span, channelId: string): void;
    push(span: Span, payload: NotificatorServicePushPayload): void;
}
export declare class NotificatorModule {
}
