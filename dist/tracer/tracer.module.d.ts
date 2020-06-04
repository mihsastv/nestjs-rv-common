import { OnApplicationShutdown } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
export { TracerService } from './tracer.service';
export { TracingInterceptor } from './tracing.interceptor';
export { Trace } from './tracing.interceptor';
export declare class TracerModule implements OnApplicationShutdown {
    private readonly moduleRef;
    constructor(moduleRef: ModuleRef);
    onApplicationShutdown(): Promise<void>;
}
export declare function ChildSpan(name: string, rethrow?: boolean): MethodDecorator;
