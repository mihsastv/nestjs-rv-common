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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const Knex = require("knex");
const locale_config_1 = require("./locale.config");
let LocaleService = class LocaleService {
    constructor(knex) {
        this.knex = knex;
        this.db = new Map();
        this.lang = locale_config_1.getLocaleConfig().lang;
    }
    get(key, defaultValue) {
        const msg = this.db.get(key);
        if (!msg) {
            if (defaultValue !== undefined) {
                return defaultValue;
            }
            return key;
        }
        return msg;
    }
    getLang() {
        return this.lang;
    }
    async init() {
        const data = await this.knex('localization').select('key', `${this.lang} as value`);
        for (const item of data) {
            this.db.set(item.key, item.value);
        }
    }
};
LocaleService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject('Knex')),
    __metadata("design:paramtypes", [Function])
], LocaleService);
exports.LocaleService = LocaleService;
//# sourceMappingURL=locale.service.js.map