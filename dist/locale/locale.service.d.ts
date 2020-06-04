import * as Knex from 'knex';
export declare class LocaleService {
    private readonly knex;
    private readonly db;
    private readonly lang;
    constructor(knex: Knex);
    get(key: string, defaultValue?: string): string;
    getLang(): string;
    init(): Promise<void>;
}
