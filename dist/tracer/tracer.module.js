"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const tracer_service_1 = require("./tracer.service");
var tracer_service_2 = require("./tracer.service");
exports.TracerService = tracer_service_2.TracerService;
var tracing_interceptor_1 = require("./tracing.interceptor");
exports.TracingInterceptor = tracing_interceptor_1.TracingInterceptor;
var tracing_interceptor_2 = require("./tracing.interceptor");
exports.Trace = tracing_interceptor_2.Trace;
let TracerModule = class TracerModule {
    constructor(moduleRef) {
        this.moduleRef = moduleRef;
    }
    async onApplicationShutdown() {
        const tracer = this.moduleRef.get(tracer_service_1.TracerService);
        tracer.close();
    }
};
TracerModule = __decorate([
    common_1.Module({
        exports: [tracer_service_1.TracerService],
        providers: [tracer_service_1.TracerService],
    }),
    __metadata("design:paramtypes", [core_1.ModuleRef])
], TracerModule);
exports.TracerModule = TracerModule;
function ChildSpan(name, rethrow = true) {
    return (_target, _propertyKey, descriptor) => {
        const method = descriptor.value;
        descriptor.value = function (parentSpan, ...args) {
            const span = parentSpan.tracer().startSpan(name, {
                childOf: parentSpan,
            });
            try {
                const result = method.call(this, span, ...args);
                if (typeof result === 'object' &&
                    result.then &&
                    result.catch &&
                    result.finally) {
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
                }
                else {
                    span.finish();
                    return result;
                }
            }
            catch (err) {
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
exports.ChildSpan = ChildSpan;
//# sourceMappingURL=tracer.module.js.map