import { Module, OnApplicationShutdown } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import * as Nats from 'nats';
import * as Hemera from 'nats-hemera';
import { getHemeraConfig } from './hemera.config';

export { HemeraTransport } from './hemera.transport';
export { RpcErrorsInterceptor } from './rpc.errors.interceptor';

const hemeraFactory = {
  provide: 'Hemera',
  useFactory: (): Hemera<{}, {}> => {
    const config = getHemeraConfig();
    return new Hemera(Nats.connect(config.nats), config.hemera);
  },
};

@Module({
  exports: [hemeraFactory],
  providers: [hemeraFactory],
})
export class HemeraModule implements OnApplicationShutdown {
  constructor(private readonly moduleRef: ModuleRef) {}

  async onApplicationShutdown() {
    const hemera = this.moduleRef.get<Hemera<{}, {}>>('Hemera');
    await hemera.close();
  }
}
