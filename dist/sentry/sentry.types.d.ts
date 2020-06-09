export interface SentryConfig {
    dsn?: string | null;
    enabled: boolean;
    hostname?: string;
    releaseName?: string;
    releaseVersion?: string;
    rootDir?: string;
    serviceName?: string;
}
