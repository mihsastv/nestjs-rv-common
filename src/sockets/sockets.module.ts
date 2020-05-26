import { Injectable, Module } from '@nestjs/common';
import * as Hemera from 'nats-hemera';
import { FORMAT_TEXT_MAP, Span } from 'opentracing';
import { HemeraModule } from '../hemera/hemera.module';
import { Logger, LoggerModule } from '../logger/logger.module';
import { TracerModule, TracerService } from '../tracer/tracer.module';

export type SocketData = Record<string, unknown>;

@Injectable()
export class SocketsService {
  constructor(
    private readonly hemera: Hemera<{}, {}>,
    private readonly logger: Logger,
    private readonly tracer: TracerService,
  ) {}

  message(span: Span, data: SocketData);
  message(span: Span, channel: string, data: SocketData);

  message(span: Span, rootEventName: string | SocketData, data?: SocketData) {
    if (typeof rootEventName === 'string' && data) {
      this.messageWithOptionalRootEventName(span, rootEventName, data);
    } else if (typeof rootEventName === 'object') {
      this.messageWithOptionalRootEventName(span, undefined, rootEventName);
    } else {
      throw new Error('Invalid SocketService.message call');
    }
  }

  private messageWithOptionalRootEventName(
    span: Span,
    rootEventName: string | undefined,
    data: SocketData,
  ) {
    data.spanContext = {};
    this.tracer.inject(span, FORMAT_TEXT_MAP, data.spanContext);

    this.hemera
      .act({
        cmd: 'socketio',
        data: rootEventName ? {
          ...data,
          rootEventName$: rootEventName,
        } : data,
        topic: 'smp',
      })
      .catch(err => this.logger.warn(err));
  }
}

@Module({
  exports: [SocketsService],
  imports: [LoggerModule, TracerModule, HemeraModule],
  providers: [SocketsService],
})
export class SocketsModule {}
