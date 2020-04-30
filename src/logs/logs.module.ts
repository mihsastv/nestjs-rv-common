import { Injectable, Module } from '@nestjs/common';
import * as Hemera from 'nats-hemera';
import { FORMAT_TEXT_MAP, Span } from 'opentracing';
import { HemeraModule } from '../hemera/hemera.module';
import { Logger, LoggerModule } from '../logger/logger.module';
import { TracerModule, TracerService } from '../tracer/tracer.module';

@Injectable()
export class LogsService {
  constructor(
    private readonly hemera: Hemera<{}, {}>,
    private readonly logger: Logger,
    private readonly tracer: TracerService,
  ) {}

  push(span: Span, payload: Record<string, unknown>) {
    payload.spanContext = {};
    this.tracer.inject(span, FORMAT_TEXT_MAP, payload.spanContext);

    this.hemera
      .act({
        cmd: 'push',
        payload,
        topic: 'log',
      })
      .catch(err => {
        this.logger.warn(err);
      });
  }
}

@Module({
  exports: [LogsService],
  imports: [LoggerModule, TracerModule, HemeraModule],
  providers: [LogsService],
})
export class LogsModule {}
