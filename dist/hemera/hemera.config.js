"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getHemeraConfig() {
    return {
        hemera: {
            childLogger: true,
            logLevel: 'error',
            timeout: 60 * 60 * 1000,
        },
        nats: {
            maxReconnectAttempts: -1,
            pass: process.env.smp_nats__password,
            reconnectTimeWait: 5000,
            url: process.env.smp_nats__url,
        },
    };
}
exports.getHemeraConfig = getHemeraConfig;
//# sourceMappingURL=hemera.config.js.map