import { OnApplicationShutdown } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
export { KnexConfig } from './knex.config';
export declare class KnexModule implements OnApplicationShutdown {
    private readonly moduleRef;
    constructor(moduleRef: ModuleRef);
    onApplicationShutdown(): Promise<void>;
}
