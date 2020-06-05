import { OnApplicationBootstrap } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
export { LocaleService } from './locale.service';
export declare class LocaleModule implements OnApplicationBootstrap {
    private readonly moduleRef;
    constructor(moduleRef: ModuleRef);
    onApplicationBootstrap(): Promise<void>;
}
