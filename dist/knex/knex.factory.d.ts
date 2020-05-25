import * as Knex from 'knex';
import { Tracer } from 'opentracing';
import { TracerService } from '../tracer/tracer.module';
import { KnexConfigProvider } from './knex.config';
export declare const KnexFactory: {
    inject: (typeof TracerService | typeof KnexConfigProvider)[];
    provide: string;
    useFactory: (tracer: Tracer, configProvider: KnexConfigProvider) => Knex<any, unknown[]>;
};
