export declare class CryptoService {
    private readonly curIV;
    private readonly curKey;
    private readonly shmey;
    private readonly shmaswd;
    constructor();
    decryptString(str: string): string;
    decrypt<T extends object, K extends keyof T>(data: T, keys: K[]): T;
    private convertBuf;
    private loadKey;
    private loadPasswordAndKey;
    private loadPwd;
}
export declare class CryptoModule {
}
