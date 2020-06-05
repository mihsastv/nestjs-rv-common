import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TracerService } from './tracer.service';
export declare const Trace: (...dataOrPipes: unknown[]) => ParameterDecorator;
export declare class TracingInterceptor implements NestInterceptor<unknown, unknown> {
    private readonly tracer;
    constructor(tracer: TracerService);
    intercept(ctx: ExecutionContext, next: CallHandler<unknown>): Observable<unknown>;
}
