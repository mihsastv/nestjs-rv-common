import * as pino from 'pino';
import { LoggerService } from '@nestjs/common';
export declare type LoggerInstance = pino.Logger;
export declare class Logger implements LoggerService {
    private readonly logger;
    constructor();
    child(options: {
        [key: string]: unknown;
    }): pino.Logger;
    debug(message: string, ...params: unknown[]): void;
    error(message: string, ...params: unknown[]): void;
    info(message: string, ...params: unknown[]): void;
    log(message: string, ...params: unknown[]): void;
    trace(message: string, ...params: unknown[]): void;
    warn(message: string, ...params: unknown[]): void;
}
