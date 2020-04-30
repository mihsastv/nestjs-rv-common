export interface KnexConfig {
  app?: string;
  knex?: {
    pool?: {
      min?: number;
      max?: number;
    };
  };
}

export function getKnexConfig(config: KnexConfig) {
  return {
    asyncStackTraces: process.env.NODE_ENV !== 'production',
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
        SET application_name='smp:${config.app ?? 'unknown'}:knex';
      `);
        done();
      },
        max: config.knex?.pool?.max ?? 5,
        min: config.knex?.pool?.min ?? 1,
    },
  };
}
