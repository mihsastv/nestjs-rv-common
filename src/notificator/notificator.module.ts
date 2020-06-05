import { Injectable, Module } from '@nestjs/common';
import * as Hemera from 'nats-hemera';
import { FORMAT_TEXT_MAP, Span } from 'opentracing';
import { HemeraModule } from '../hemera/hemera.module';
import { Logger, LoggerModule } from '../logger/logger.module';
import { TracerModule, TracerService } from '../tracer/tracer.module';


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

@Injectable()
export class NotificatorService {
  constructor(
    private readonly hemera: Hemera<{}, {}>,
    private readonly logger: Logger,
    private readonly tracer: TracerService,
  ) {}

  commit(span: Span, channelId: string) {
    const payload = {
      channelId,
      spanContext: {},
    };
    this.tracer.inject(span, FORMAT_TEXT_MAP, payload.spanContext);

    this.hemera
      .act({
        cmd: `notifications:commit`,
        payload,
        topic: 'notificator',
      })
      .catch(err => this.logger.warn(err));
  }

  push(span: Span, payload: NotificatorServicePushPayload) {
    const payloadWithContext = {
      ...payload,
      spanContext: {},
    };
    this.tracer.inject(span, FORMAT_TEXT_MAP, payloadWithContext.spanContext);

    this.hemera
      .act({
        cmd: `notifications:push`,
        payload: payloadWithContext,
        topic: 'notificator',
      })
      .catch(err => this.logger.warn(err));
  }
}

@Module({
  exports: [NotificatorService],
  imports: [LoggerModule, TracerModule, HemeraModule],
  providers: [
    NotificatorService,
  ],
})
export class NotificatorModule {}
