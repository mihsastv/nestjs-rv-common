import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import * as Nats from 'nats';
import * as Hemera from 'nats-hemera';
export interface HemeraOptions {
    hemera: Hemera.Config;
    nats: Nats.ClientOpts;
}
export declare class HemeraTransport extends Server implements CustomTransportStrategy {
    private readonly hemeraClient;
    private readonly natsClient;
    private readonly url;
    constructor();
    listen(callback: () => void): void;
    close(): Promise<void>;
    private handleMessage;
    private setupMessageHandlers;
    private bindMessageHandlers;
    private setupErrorHandler;
}
