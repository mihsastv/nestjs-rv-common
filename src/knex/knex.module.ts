import { Module, OnApplicationShutdown } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import * as Knex from 'knex';
import { TracerModule } from '../tracing/tracer.module';
import { KnexFactory } from './knex.factory';

@Module({
  exports: [KnexFactory],
  imports: [TracerModule],
  providers: [KnexFactory],
})
export class KnexModule implements OnApplicationShutdown {
  constructor(private readonly moduleRef: ModuleRef) {}

  async onApplicationShutdown() {
    const knex = this.moduleRef.get<Knex>('Knex');
    await knex.destroy();
  }
}
