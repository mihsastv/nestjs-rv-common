import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { RewriteFrames } from '@sentry/integrations';
import * as Sentry from '@sentry/node';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { getSentryConfig } from './sentry.config';
import { SentryConfig } from './sentry.types';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  tags: { [key: string]: string };
  private config: SentryConfig;

  constructor(serviceName: string) {
    this.config = getSentryConfig();
    this.tags = {
      hostname: this.config.hostname || '',
      module: this.config.serviceName || serviceName,
    };

    if (this.config.enabled && this.config.dsn) {
      Sentry.init({
        attachStacktrace: true,
        dsn: this.config.dsn,
        integrations: [
          new RewriteFrames({
            root: this.config.rootDir,
          }),
        ],
        release: `${this.config.releaseName}@${this.config.releaseVersion}`,
      });
    }
  }

  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        const rpc = _context.switchToRpc();
        Sentry.withScope((scope) => {
          scope.setTags(this.tags);
          scope.setExtras({ payload: this.getRpcData(rpc) });
          Sentry.captureException(err);
        });
        return throwError(err);
      }),
    );
  }

  private getRpcData(rpc) {
    try {
      return JSON.stringify(rpc.getData());
    } catch (err) {
      return rpc.getData();
    }
  }
}
