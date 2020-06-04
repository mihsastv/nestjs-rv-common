import { OnApplicationShutdown } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
export { HemeraTransport } from './hemera.transport';
export { RpcErrorsInterceptor } from './rpc.errors.interceptor';
export declare class HemeraModule implements OnApplicationShutdown {
    private readonly moduleRef;
    constructor(moduleRef: ModuleRef);
    onApplicationShutdown(): Promise<void>;
}
