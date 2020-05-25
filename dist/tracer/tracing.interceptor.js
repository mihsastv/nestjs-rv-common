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
const opentracing_1 = require("opentracing");
const operators_1 = require("rxjs/operators");
const tracer_service_1 = require("./tracer.service");
exports.Trace = common_1.createParamDecorator((_data, ctx) => {
    if (ctx.getType() === 'http') {
        return ctx.switchToHttp().getRequest().span;
    }
    else if (ctx.getType() === 'rpc') {
        return ctx.switchToRpc().getContext().span;
    }
});
let TracingInterceptor = class TracingInterceptor {
    constructor(tracer) {
        this.tracer = tracer;
    }
    intercept(ctx, next) {
        var _a;
        let span;
        if (ctx.getType() === 'rpc') {
            const rpcPayload = ctx.switchToRpc().getData();
            const rpcContext = ctx.switchToRpc().getContext();
            let parentSpanContext;
            if (rpcPayload === null || rpcPayload === void 0 ? void 0 : rpcPayload.spanContext) {
                parentSpanContext = (_a = this.tracer.extract(opentracing_1.FORMAT_TEXT_MAP, rpcPayload.spanContext)) !== null && _a !== void 0 ? _a : undefined;
                delete rpcPayload.spanContext;
            }
            span = this.tracer.startSpan(`${ctx.getClass().name}.${ctx.getHandler().name}`, {
                childOf: parentSpanContext,
            });
            span.log({ payload: JSON.stringify(rpcPayload) });
            rpcContext.span = span;
        }
        else if (ctx.getType() === 'http') {
            const req = ctx.switchToHttp().getRequest();
            span = this.tracer.startSpan(`${ctx.getClass().name}.${ctx.getHandler().name}`, {
                tags: {
                    [opentracing_1.Tags.HTTP_METHOD]: req.method,
                    [opentracing_1.Tags.HTTP_URL]: req.url,
                },
            });
            req.span = span;
        }
        return next.handle().pipe(operators_1.tap(() => span.finish(), err => {
            span.setTag('error', true);
            span.setTag('error.message', err.message);
            span.log({ stack: err.stack });
            span.finish();
            return err;
        }));
    }
};
TracingInterceptor = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [tracer_service_1.TracerService])
], TracingInterceptor);
exports.TracingInterceptor = TracingInterceptor;
//# sourceMappingURL=tracing.interceptor.js.map