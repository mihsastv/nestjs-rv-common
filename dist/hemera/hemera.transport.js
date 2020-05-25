"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const microservices_1 = require("@nestjs/microservices");
const constants_1 = require("@nestjs/microservices/constants");
const Nats = require("nats");
const Hemera = require("nats-hemera");
const hemera_config_1 = require("./hemera.config");
class HemeraTransport extends microservices_1.Server {
    constructor() {
        super();
        const config = hemera_config_1.getHemeraConfig();
        this.url = config.nats.url || constants_1.NATS_DEFAULT_URL;
        this.natsClient = Nats.connect(Object.assign(Object.assign({}, config.nats), { url: this.url }));
        this.hemeraClient = new Hemera(this.natsClient, config.hemera);
    }
    listen(callback) {
        this.setupErrorHandler(this.natsClient);
        this.setupMessageHandlers(callback);
    }
    async close() {
        if (this.hemeraClient) {
            await this.hemeraClient.close();
        }
        if (this.natsClient) {
            this.natsClient.close();
        }
    }
    handleMessage(pattern, req, done) {
        const handler = this.getHandlerByPattern(pattern);
        if (!handler) {
            throw new Error(`No handler for pattern: ${pattern}`);
        }
        handler(req.payload, req)
            .then(res => this.transformToObservable(res))
            .then(res$ => this.send(res$, data => done(data.err, data.response)))
            .catch(err => done(err));
    }
    setupMessageHandlers(callback) {
        this.hemeraClient.ready(err => {
            if (err)
                throw err;
            this.bindMessageHandlers();
            callback();
        });
    }
    bindMessageHandlers() {
        for (const pattern of this.messageHandlers.keys()) {
            this.hemeraClient.add(JSON.parse(pattern), (req, done) => this.handleMessage(pattern, req, done));
        }
    }
    setupErrorHandler(stream) {
        stream.on(constants_1.ERROR_EVENT, err => this.logger.error(err));
    }
}
exports.HemeraTransport = HemeraTransport;
//# sourceMappingURL=hemera.transport.js.map