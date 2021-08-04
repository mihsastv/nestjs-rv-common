import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { getLocaleConfig, Lang } from './locale.config';

@Injectable()
export class LocaleService {
  private readonly db: Map<string, string>;
  private readonly lang: Lang;

  constructor(
    @Inject('Knex') private readonly knex: Knex,
  ) {
    this.db = new Map();
    this.lang = getLocaleConfig().lang;
  }

  get(key: string, defaultValue?: string): string {
    const msg = this.db.get(key);

    if (!msg) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }

      return key;
    }

    return msg;
  }

  getLang(): string {
    return this.lang;
  }

  async init() {
    const data: { key: string; value: string }[] = await this.knex(
      'localization',
    ).select('key', `${this.lang} as value`);

    for (const item of data) {
      this.db.set(item.key, item.value);
    }
  }
}
