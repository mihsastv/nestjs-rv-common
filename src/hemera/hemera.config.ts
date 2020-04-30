import * as Nats from 'nats';
import * as Hemera from 'nats-hemera';

export function getHemeraConfig() {
  return {
    hemera: {
      childLogger: true,
      logLevel: 'error',
      timeout: 60 * 60 * 1000,
    } as Hemera.Config,

    nats: {
      maxReconnectAttempts: -1,
      pass: process.env.smp_nats__password,
      reconnectTimeWait: 5000,
      url: process.env.smp_nats__url,
    } as Nats.ClientOpts,
  }
}
