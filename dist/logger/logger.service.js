"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pino = require("pino");
const logger_config_1 = require("./logger.config");
class Logger {
    constructor() {
        this.logger = pino({
            hooks: {
                logMethod(args, method) {
                    for (let i = 1; i < args.length; i++) {
                        args[0] += ' %j';
                    }
                    method.apply(this, args);
                },
            },
            level: logger_config_1.getLoggerConfig().level,
            name: 'auth',
            prettyPrint: {
                colorize: true,
                ignore: 'pid,time,hostname,name',
            },
            timestamp: false,
        }, pino.destination());
    }
    child(options) {
        return this.logger.child(options);
    }
    debug(message, ...params) {
        this.logger.debug(message, ...params);
    }
    error(message, ...params) {
        this.logger.error(message, ...params);
    }
    info(message, ...params) {
        this.logger.info(message, ...params);
    }
    log(message, ...params) {
        this.logger.info(message, ...params);
    }
    trace(message, ...params) {
        this.logger.trace(message, ...params);
    }
    warn(message, ...params) {
        this.logger.warn(message, ...params);
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.service.js.map