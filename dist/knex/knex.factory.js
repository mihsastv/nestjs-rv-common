"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Knex = require("knex");
const sqlFormatter = require("sql-formatter");
const tracer_module_1 = require("../tracer/tracer.module");
const knex_config_1 = require("./knex.config");
function getSpanNameFromQueryContext(queryContext) {
    let spanName = 'knex';
    if (queryContext && queryContext.tags) {
        const { class: className, method } = queryContext.tags;
        spanName = `${spanName} ${className}.${method}()`;
    }
    return spanName;
}
exports.KnexFactory = {
    inject: [tracer_module_1.TracerService, knex_config_1.KnexConfigProvider],
    provide: 'Knex',
    useFactory: (tracer, configProvider) => {
        const db = Knex(configProvider.getKnexConfig());
        if (String(process.env.JAEGER_DISABLED).toLowerCase() === 'false') {
            db.on('start', builder => {
                const { _queryContext: queryContext } = builder;
                const rootSpan = queryContext && (queryContext.spanContext || queryContext.span);
                const knexSpan = tracer.startSpan(getSpanNameFromQueryContext(queryContext), {
                    childOf: rootSpan,
                    tags: (queryContext && queryContext.tags) || {},
                });
                const logs = (queryContext && queryContext.logs) || {};
                for (const [key, value] of Object.entries(logs)) {
                    if (typeof value === 'string' &&
                        (value.startsWith('select') ||
                            value.startsWith('insert') ||
                            value.startsWith('update') ||
                            value.startsWith('delete') ||
                            value.startsWith('with'))) {
                        logs[key] = sqlFormatter.format(value);
                    }
                }
                knexSpan.log(Object.assign(Object.assign({}, logs), { sql: sqlFormatter.format(builder.toString()) }));
                builder.queryContext({ knexSpan });
                builder.on('query-error', (err) => {
                    if (knexSpan) {
                        knexSpan.setTag('error', true);
                        knexSpan.setTag('error.message', err.message);
                        knexSpan.log({ stack: err.stack });
                        knexSpan.finish();
                    }
                });
            });
            db.on('query-response', (_response, _obj, builder) => {
                var _a;
                const knexSpan = (_a = builder._queryContext) === null || _a === void 0 ? void 0 : _a.knexSpan;
                if (knexSpan) {
                    knexSpan.finish();
                }
            });
        }
        return db;
    },
};
//# sourceMappingURL=knex.factory.js.map