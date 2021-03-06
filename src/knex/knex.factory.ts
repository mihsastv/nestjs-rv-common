import { Tracer } from 'opentracing';
import * as sqlFormatter from 'sql-formatter';
import { TracerService } from '../tracer/tracer.module';
import { KnexConfigProvider } from './knex.config';
import knex, {Knex} from 'knex';


function getSpanNameFromQueryContext(queryContext) {
  let spanName = 'knex';

  if (queryContext && queryContext.tags) {
    const { class: className, method } = queryContext.tags;
    spanName = `${spanName} ${className}.${method}()`;
  }

  return spanName;
}

export const KnexFactory = {
  inject: [TracerService, KnexConfigProvider],
  provide: 'Knex',
  useFactory: (tracer: Tracer, configProvider: KnexConfigProvider): Knex => {
    const db = knex(configProvider.getKnexConfig());

    if (String(process.env.JAEGER_DISABLED).toLowerCase() === 'false') {
      db.on('start', builder => {
        const { _queryContext: queryContext } = builder;
        const rootSpan =
          queryContext && (queryContext.spanContext || queryContext.span);

        const knexSpan = tracer.startSpan(
          getSpanNameFromQueryContext(queryContext),
          {
            childOf: rootSpan,
            tags: (queryContext && queryContext.tags) || {},
          },
        );

        const logs = (queryContext && queryContext.logs) || {};

        for (const [key, value] of Object.entries(logs)) {
          if (
            typeof value === 'string' &&
            (value.startsWith('select') ||
              value.startsWith('insert') ||
              value.startsWith('update') ||
              value.startsWith('delete') ||
              value.startsWith('with'))
          ) {
            logs[key] = sqlFormatter.format(value);
          }
        }

        knexSpan.log({
          ...logs,
          sql: sqlFormatter.format(builder.toString()),
        });

        builder.queryContext({ knexSpan });

        builder.on('query-error', (err) => {
          if (knexSpan) {
            knexSpan.setTag('error', true);
            knexSpan.setTag('error.message', err.message);
            knexSpan.log({ stack: err.stack });
            knexSpan.finish();
          }
        })
      });

      db.on('query-response', (_response, _obj, builder) => {
        const knexSpan = builder._queryContext?.knexSpan;

        if (knexSpan) {
          knexSpan.finish();
        }
      });
    }

    return db;
  },
};
