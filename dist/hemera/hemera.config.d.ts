import * as Nats from 'nats';
import * as Hemera from 'nats-hemera';
export declare function getHemeraConfig(): {
    hemera: Hemera.Config;
    nats: Nats.ClientOpts;
};
