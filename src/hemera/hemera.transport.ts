import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import { ERROR_EVENT, NATS_DEFAULT_URL } from '@nestjs/microservices/constants';
import * as Nats from 'nats';
import * as Hemera from 'nats-hemera';
import { getHemeraConfig } from './hemera.config';

export interface HemeraOptions {
  hemera: Hemera.Config;
  nats: Nats.ClientOpts;
}

export class HemeraTransport extends Server implements CustomTransportStrategy {
  private readonly hemeraClient: Hemera<{}, {}>;
  private readonly natsClient: Nats.Client;
  private readonly url: string;

  constructor() {
    super();

    const config = getHemeraConfig();

    this.url = config.nats.url || NATS_DEFAULT_URL;
    this.natsClient = Nats.connect({
      ...config.nats,
      url: this.url,
    });

    this.hemeraClient = new Hemera(this.natsClient, config.hemera);
  }

  listen(callback: () => void) {
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

  private handleMessage(
    pattern: string,
    req: Hemera.ServerPattern,
    done: Hemera.NodeCallback,
  ) {
    const handler = this.getHandlerByPattern(pattern);
    if (!handler) {
      throw new Error(`No handler for pattern: ${pattern}`);
    }

    const response$ = this.transformToObservable(handler(req.payload, req));

    this.send(response$, response => done(response.err, response.response));
  }

  private setupMessageHandlers(callback: () => void) {
    this.hemeraClient.ready(err => {
      if (err) throw err;
      this.bindMessageHandlers();
      callback();
    });
  }

  private bindMessageHandlers() {
    for (const pattern of this.messageHandlers.keys()) {
      this.hemeraClient.add(JSON.parse(pattern), (req, done) =>
        this.handleMessage(pattern, req, done),
      );
    }
  }

  private setupErrorHandler(stream) {
    stream.on(ERROR_EVENT, err => this.logger.error(err));
  }
}
