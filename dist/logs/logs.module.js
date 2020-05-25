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
const Hemera = require("nats-hemera");
const opentracing_1 = require("opentracing");
const hemera_module_1 = require("../hemera/hemera.module");
const logger_module_1 = require("../logger/logger.module");
const tracer_module_1 = require("../tracer/tracer.module");
let LogsService = class LogsService {
    constructor(hemera, logger, tracer) {
        this.hemera = hemera;
        this.logger = logger;
        this.tracer = tracer;
    }
    push(span, payload) {
        payload.spanContext = {};
        this.tracer.inject(span, opentracing_1.FORMAT_TEXT_MAP, payload.spanContext);
        this.hemera
            .act({
            cmd: 'push',
            payload,
            topic: 'log',
        })
            .catch(err => {
            this.logger.warn(err);
        });
    }
};
LogsService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [Hemera,
        logger_module_1.Logger,
        tracer_module_1.TracerService])
], LogsService);
exports.LogsService = LogsService;
let LogsModule = class LogsModule {
};
LogsModule = __decorate([
    common_1.Module({
        exports: [LogsService],
        imports: [logger_module_1.LoggerModule, tracer_module_1.TracerModule, hemera_module_1.HemeraModule],
        providers: [LogsService],
    })
], LogsModule);
exports.LogsModule = LogsModule;
//# sourceMappingURL=logs.module.js.map