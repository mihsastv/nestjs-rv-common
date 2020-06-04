import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class RpcErrorsInterceptor implements NestInterceptor<unknown, unknown> {
    intercept(_context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown>;
}
