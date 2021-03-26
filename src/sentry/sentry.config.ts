import { SentryConfig } from './sentry.types';

const {
  HOSTNAME,
  RELEASE_NAME,
  RELEASE_VERSION,
  SMP_SERVICE_NAME,
  cwd,
  smp_sentry__dsn,
  smp_sentry__maxlen,
} = process.env;

export function getSentryConfig(): SentryConfig {
  return {
    dsn: smp_sentry__dsn,
    enabled: Boolean(smp_sentry__dsn),
    hostname: HOSTNAME,
    maxValueLength: Number(smp_sentry__maxlen) || 5000,
    releaseName: RELEASE_NAME,
    releaseVersion: RELEASE_VERSION,
    rootDir: cwd,
    serviceName: SMP_SERVICE_NAME,
  };
}
