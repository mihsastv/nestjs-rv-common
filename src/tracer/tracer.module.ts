import { Module, OnApplicationShutdown } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Span } from 'opentracing';
import { TracerService } from './tracer.service';

export { TracerService } from './tracer.service';
export { TracingInterceptor } from './tracing.interceptor';
export { Trace } from './tracing.interceptor';

@Module({
  exports: [TracerService],
  providers: [TracerService],
})
export class TracerModule implements OnApplicationShutdown {
  constructor(private readonly moduleRef: ModuleRef) {}

  async onApplicationShutdown() {
    const tracer = this.moduleRef.get(TracerService);
    tracer.close();
  }
}

export function ChildSpan(
  name: string,
  rethrow = true,
): MethodDecorator {
  return (
    _target: unknown,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const method = descriptor.value;

    descriptor.value = function(parentSpan: Span, ...args) {
      const span = parentSpan.tracer().startSpan(name, {
        childOf: parentSpan,
      });

      try {
        const result = method.call(this, span, ...args);

        if (
          typeof result === 'object' &&
          result.then &&
          result.catch &&
          result.finally
        ) {
          return result
            .catch(err => {
              span.setTag('error', true);
              span.setTag('error.message', err && err.message);
              span.log({ stack: err && err.stack });

              if (rethrow) {
                throw err;
              }
            })
            .finally(() => span.finish());
        } else {
          span.finish();
          return result;
        }
      } catch (err) {
        span.setTag('error', true);
        span.setTag('error.message', err && err.message);
        span.log({ stack: err && err.stack });

        span.finish();

        if (rethrow) {
          throw err;
        }
      }
    };
  };
}
