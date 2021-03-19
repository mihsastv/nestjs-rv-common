import { Inject, Injectable, Optional } from '@nestjs/common';

export interface KnexConfig {
  app?: string;
  knex?: {
    pool?: {
      min?: number;
      max?: number;
    };
  };
}

@Injectable()
export class KnexConfigProvider {
  constructor(
    @Optional() @Inject('Config') private readonly config?: KnexConfig,
  ) {}

  getKnexConfig() {
    return {
      asyncStackTraces:
        process.env.NODE_ENV !== 'production' ||
        Boolean(process.env.smp_sentry__dsn),
      client: 'pg',
      connection: {
        database: process.env.smp_db__name,
        host: process.env.smp_db__host,
        password: process.env.smp_db__pass,
        port: Number(process.env.smp_db__port),
        timezone: process.env.smp_db__timezone,
        user: process.env.smp_db__user,
      },
      pool: {
        afterCreate: async (conn, done) => {
          await conn.query(`
        SET timezone="UTC";
        SET application_name='smp:${this.config?.app ?? 'unknown'}:knex';
      `);
          done();
        },
        max: this.config?.knex?.pool?.max ?? 5,
        min: this.config?.knex?.pool?.min ?? 1,
      },
    };
  }
}
