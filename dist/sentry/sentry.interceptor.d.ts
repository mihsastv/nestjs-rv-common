import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class SentryInterceptor implements NestInterceptor {
    tags: {
        [key: string]: string;
    };
    private config;
    constructor(serviceName: string);
    intercept(_context: ExecutionContext, next: CallHandler): Observable<any>;
    private getRpcData;
}
