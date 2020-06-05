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
const tracer_module_1 = require("../tracer/tracer.module");
const knex_config_1 = require("./knex.config");
const knex_factory_1 = require("./knex.factory");
let KnexModule = class KnexModule {
    constructor(moduleRef) {
        this.moduleRef = moduleRef;
    }
    async onApplicationShutdown() {
        const knex = this.moduleRef.get('Knex');
        await knex.destroy();
    }
};
KnexModule = __decorate([
    common_1.Module({
        exports: [knex_factory_1.KnexFactory],
        imports: [tracer_module_1.TracerModule],
        providers: [knex_factory_1.KnexFactory, knex_config_1.KnexConfigProvider],
    }),
    __metadata("design:paramtypes", [core_1.ModuleRef])
], KnexModule);
exports.KnexModule = KnexModule;
//# sourceMappingURL=knex.module.js.map