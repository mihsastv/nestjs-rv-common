import { Module, OnApplicationShutdown } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { TracerModule } from '../tracer/tracer.module';
import { KnexConfigProvider } from './knex.config';
import { KnexFactory } from './knex.factory';
import { Knex } from 'knex';

export { KnexConfig } from './knex.config';

@Module({
  exports: [KnexFactory],
  imports: [TracerModule],
  providers: [KnexFactory, KnexConfigProvider],
})
export class KnexModule implements OnApplicationShutdown {
  constructor(private readonly moduleRef: ModuleRef) {}

  async onApplicationShutdown() {
    const knex = this.moduleRef.get<Knex>('Knex');
    await knex.destroy();
  }
}
