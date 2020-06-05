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
let KnexConfigProvider = class KnexConfigProvider {
    constructor(config) {
        this.config = config;
    }
    getKnexConfig() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return {
            asyncStackTraces: process.env.NODE_ENV !== 'production',
            client: 'pg',
            connection: {
                database: process.env.smp_db__name,
                host: process.env.smp_db__host,
                password: process.env.smp_db__pass,
                port: Number(process.env.smp_db__port),
                timezone: process.env.smp_db__timezone,
                user: process.env.smp_db__user,
            },
            pool: {
                afterCreate: async (conn, done) => {
                    var _a, _b;
                    await conn.query(`
        SET timezone="UTC";
        SET application_name='smp:${(_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.app) !== null && _b !== void 0 ? _b : 'unknown'}:knex';
      `);
                    done();
                },
                max: (_d = (_c = (_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.knex) === null || _b === void 0 ? void 0 : _b.pool) === null || _c === void 0 ? void 0 : _c.max) !== null && _d !== void 0 ? _d : 5,
                min: (_h = (_g = (_f = (_e = this.config) === null || _e === void 0 ? void 0 : _e.knex) === null || _f === void 0 ? void 0 : _f.pool) === null || _g === void 0 ? void 0 : _g.min) !== null && _h !== void 0 ? _h : 1,
            },
        };
    }
};
KnexConfigProvider = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Optional()), __param(0, common_1.Inject('Config')),
    __metadata("design:paramtypes", [Object])
], KnexConfigProvider);
exports.KnexConfigProvider = KnexConfigProvider;
//# sourceMappingURL=knex.config.js.map