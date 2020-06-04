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
const jaeger_client_1 = require("jaeger-client");
let TracerService = class TracerService extends jaeger_client_1.Tracer {
    constructor() {
        super();
        if (!process.env.JAEGER_SERVICE_NAME) {
            process.env.JAEGER_SERVICE_NAME = 'assets';
        }
        this.tracer = jaeger_client_1.initTracerFromEnv();
    }
    extract(format, carrier) {
        return this.tracer.extract(format, carrier);
    }
    inject(spanContext, format, carrier) {
        return this.tracer.inject(spanContext, format, carrier);
    }
    startSpan(name, options) {
        return this.tracer.startSpan(name, options);
    }
    close() {
        this.tracer.close();
    }
    _extract(format, carrier) {
        return this.tracer.extract(format, carrier);
    }
    _inject(spanContext, format, carrier) {
        return this.tracer.inject(spanContext, format, carrier);
    }
    _startSpan(name, fields) {
        return this.tracer.startSpan(name, fields);
    }
};
TracerService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [])
], TracerService);
exports.TracerService = TracerService;
let TracerModule = class TracerModule {
    constructor(moduleRef) {
        this.moduleRef = moduleRef;
    }
    async onApplicationShutdown() {
        const tracer = this.moduleRef.get(TracerService);
        tracer.close();
    }
};
TracerModule = __decorate([
    common_1.Module({
        exports: [TracerService],
        providers: [TracerService],
    }),
    __metadata("design:paramtypes", [core_1.ModuleRef])
], TracerModule);
exports.TracerModule = TracerModule;
//# sourceMappingURL=tracer.module.js.map