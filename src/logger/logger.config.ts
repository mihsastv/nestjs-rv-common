export function getLoggerConfig() {
  return {
    level: process.env.smp_log__level ?? 'info'
  };
}
