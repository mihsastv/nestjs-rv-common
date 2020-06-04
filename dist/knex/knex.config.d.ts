export interface KnexConfig {
    app?: string;
    knex?: {
        pool?: {
            min?: number;
            max?: number;
        };
    };
}
export declare class KnexConfigProvider {
    private readonly config?;
    constructor(config?: KnexConfig | undefined);
    getKnexConfig(): {
        asyncStackTraces: boolean;
        client: string;
        connection: {
            database: string | undefined;
            host: string | undefined;
            password: string | undefined;
            port: number;
            timezone: string | undefined;
            user: string | undefined;
        };
        pool: {
            afterCreate: (conn: any, done: any) => Promise<void>;
            max: number;
            min: number;
        };
    };
}
