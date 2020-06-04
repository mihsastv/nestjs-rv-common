"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getLoggerConfig() {
    var _a;
    return {
        level: (_a = process.env.smp_log__level) !== null && _a !== void 0 ? _a : 'info'
    };
}
exports.getLoggerConfig = getLoggerConfig;
//# sourceMappingURL=logger.config.js.map