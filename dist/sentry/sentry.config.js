"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { HOSTNAME, RELEASE_NAME, RELEASE_VERSION, SMP_SERVICE_NAME, cwd, smp_sentry__dsn, } = process.env;
function getSentryConfig() {
    return {
        dsn: smp_sentry__dsn,
        enabled: Boolean(smp_sentry__dsn),
        hostname: HOSTNAME,
        releaseName: RELEASE_NAME,
        releaseVersion: RELEASE_VERSION,
        rootDir: cwd,
        serviceName: SMP_SERVICE_NAME,
    };
}
exports.getSentryConfig = getSentryConfig;
//# sourceMappingURL=sentry.config.js.map