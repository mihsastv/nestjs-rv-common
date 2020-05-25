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
const knex_module_1 = require("../knex/knex.module");
const locale_service_1 = require("./locale.service");
var locale_service_2 = require("./locale.service");
exports.LocaleService = locale_service_2.LocaleService;
let LocaleModule = class LocaleModule {
    constructor(moduleRef) {
        this.moduleRef = moduleRef;
    }
    async onApplicationBootstrap() {
        const i18n = this.moduleRef.get(locale_service_1.LocaleService);
        await i18n.init();
    }
};
LocaleModule = __decorate([
    common_1.Module({
        exports: [locale_service_1.LocaleService],
        imports: [knex_module_1.KnexModule],
        providers: [locale_service_1.LocaleService],
    }),
    __metadata("design:paramtypes", [core_1.ModuleRef])
], LocaleModule);
exports.LocaleModule = LocaleModule;
//# sourceMappingURL=locale.module.js.map