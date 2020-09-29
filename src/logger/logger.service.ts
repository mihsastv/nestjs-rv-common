import * as pino from 'pino';

import { LoggerService } from '@nestjs/common';
import { getLoggerConfig } from './logger.config';

export type LoggerInstance = pino.Logger;

export class Logger implements LoggerService {
  private readonly logger: LoggerInstance;

  constructor() {
    this.logger = pino(
      {
        customLevels: {
          verbose: 25,
          silly: 5,
        },
        // TODO Нету в @types/pino , когда поправят можно будет убрать
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        hooks: {
          logMethod(args, method) {
            for (let i = 1; i < args.length; i++) {
              args[0] += ' %j';
            }

            method.apply(this, args);
          },
        },
        level: getLoggerConfig().level,
        name: 'auth',
        prettyPrint: {
          colorize: true,
          ignore: 'pid,time,hostname,name',
        },
        timestamp: false,
      },
      pino.destination(),
    );
  }

  child(options: { [key: string]: unknown }): pino.Logger {
    return this.logger.child(options);
  }

  debug(message: string, ...params: unknown[]) {
    this.logger.debug(message, ...params);
  }

  error(message: string, ...params: unknown[]) {
    this.logger.error(message, ...params);
  }

  info(message: string, ...params: unknown[]) {
    this.logger.info(message, ...params);
  }

  log(message: string, ...params: unknown[]) {
    this.logger.info(message, ...params);
  }

  trace(message: string, ...params: unknown[]) {
    this.logger.trace(message, ...params);
  }

  warn(message: string, ...params: unknown[]) {
    this.logger.warn(message, ...params);
  }
}
