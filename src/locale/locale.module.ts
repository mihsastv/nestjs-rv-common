import {
  Module,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { KnexModule } from '../knex/knex.module';
import { LocaleService} from './locale.service';

export { LocaleService } from './locale.service';

@Module({
  exports: [LocaleService],
  imports: [KnexModule],
  providers: [LocaleService],
})
export class LocaleModule implements OnApplicationBootstrap {
  constructor(private readonly moduleRef: ModuleRef) {}

  async onApplicationBootstrap() {
    const i18n = this.moduleRef.get(LocaleService);
    await i18n.init();
  }
}
