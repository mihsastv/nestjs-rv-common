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
const Nats = require("nats");
const Hemera = require("nats-hemera");
const hemera_config_1 = require("./hemera.config");
var hemera_transport_1 = require("./hemera.transport");
exports.HemeraTransport = hemera_transport_1.HemeraTransport;
var rpc_errors_interceptor_1 = require("./rpc.errors.interceptor");
exports.RpcErrorsInterceptor = rpc_errors_interceptor_1.RpcErrorsInterceptor;
const hemeraFactory = {
    provide: 'Hemera',
    useFactory: () => {
        const config = hemera_config_1.getHemeraConfig();
        return new Hemera(Nats.connect(config.nats), config.hemera);
    },
};
let HemeraModule = class HemeraModule {
    constructor(moduleRef) {
        this.moduleRef = moduleRef;
    }
    async onApplicationShutdown() {
        const hemera = this.moduleRef.get('Hemera');
        await hemera.close();
    }
};
HemeraModule = __decorate([
    common_1.Module({
        exports: [hemeraFactory],
        providers: [hemeraFactory],
    }),
    __metadata("design:paramtypes", [core_1.ModuleRef])
], HemeraModule);
exports.HemeraModule = HemeraModule;
//# sourceMappingURL=hemera.module.js.map