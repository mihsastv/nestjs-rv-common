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
const integrations_1 = require("@sentry/integrations");
const Sentry = require("@sentry/node");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const sentry_config_1 = require("./sentry.config");
let SentryInterceptor = class SentryInterceptor {
    constructor(serviceName) {
        this.config = sentry_config_1.getSentryConfig();
        this.tags = {
            hostname: this.config.hostname || '',
            module: this.config.serviceName || serviceName,
        };
        if (this.config.enabled && this.config.dsn) {
            Sentry.init({
                attachStacktrace: true,
                dsn: this.config.dsn,
                integrations: [
                    new integrations_1.RewriteFrames({
                        root: this.config.rootDir,
                    }),
                ],
                release: `${this.config.releaseName}@${this.config.releaseVersion}`,
            });
        }
    }
    intercept(_context, next) {
        return next.handle().pipe(operators_1.catchError((err) => {
            const rpc = _context.switchToRpc();
            Sentry.withScope((scope) => {
                scope.setTags(this.tags);
                scope.setExtras({ payload: this.getRpcData(rpc) });
                Sentry.captureException(err);
            });
            return rxjs_1.throwError(err);
        }));
    }
    getRpcData(rpc) {
        try {
            return JSON.stringify(rpc.getData());
        }
        catch (err) {
            return rpc.getData();
        }
    }
};
SentryInterceptor = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [String])
], SentryInterceptor);
exports.SentryInterceptor = SentryInterceptor;
//# sourceMappingURL=sentry.interceptor.js.map