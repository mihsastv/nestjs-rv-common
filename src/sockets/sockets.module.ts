import { Injectable, Module } from '@nestjs/common';
import * as Hemera from 'nats-hemera';
import { FORMAT_TEXT_MAP, Span } from 'opentracing';
import { HemeraModule } from '../hemera/hemera.module';
import { Logger, LoggerModule } from '../logger/logger.module';
import { TracerModule, TracerService } from '../tracer/tracer.module';

@Injectable()
export class SocketsService {
  constructor(
    private readonly hemera: Hemera<{}, {}>,
    private readonly logger: Logger,
    private readonly tracer: TracerService,
  ) {}

  message(span: Span, data: Record<string, unknown>) {
    data.spanContext = {};
    this.tracer.inject(span, FORMAT_TEXT_MAP, data.spanContext);

    this.hemera
      .act({
        cmd: 'socketio',
        data,
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
