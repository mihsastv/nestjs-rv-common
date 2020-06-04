import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TracerService } from './tracer.module';
export declare class TracingInterceptor implements NestInterceptor {
    private readonly tracer;
    constructor(tracer: TracerService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown>;
}
