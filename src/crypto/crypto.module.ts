import { Injectable, Module } from '@nestjs/common';
import { ok } from 'assert';
import * as crypto from 'crypto';
import { readFileSync } from 'fs';
import { get, set } from 'lodash';
import { join } from 'path';

const aesAlgName = 'aes256'; // Ciphering algorithm name.
const aesKeyLength = 256 / 8; // AES Key Length (bytes).
const iVLength = 128 / 8; // Initialization Vector length (bytes).
const nonStrictDbEncryption = process.env.DEF_NON_STRICT_DB_ENCRYPTION;
const prefix = '#$*';
const xxx = 18;

@Injectable()
export class CryptoService {
  private readonly curIV: Buffer;
  private readonly curKey: Buffer;

  private readonly shmey: string;
  private readonly shmaswd: string;

  constructor() {
    ok(process.env.smp_cryptoKeysDir, 'smp_cryptoKeysDir is not set');

    const dataPath = process.env.smp_cryptoKeysDir as string;
    const ngPrefix = '-' + 'no-' + 'git';
    this.shmey = join(dataPath, 'par' + 'ams' + ngPrefix);
    this.shmaswd = join(dataPath, 'par' + 'ams1' + ngPrefix);

    const { curIV, curKey } = this.loadPasswordAndKey();
    this.curIV = curIV;
    this.curKey = curKey;
  }

  decryptString(str: string): string {
    const decipher = crypto.createDecipheriv(
      aesAlgName,
      this.curKey,
      this.curIV,
    );

    let decrypted = decipher.update(str, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  decrypt<T extends object, K extends keyof T>(data: T, keys: K[]): T {
    const result = { ...data };

    for (const key of keys) {
      const value = get(data, key);

      if (value && typeof value === 'string') {
        const decryptedValue = this.decryptString(value);

        set(result, key, decryptedValue);
      }
    }

    return result;
  }

  encryptString(str: string): string {
    if (nonStrictDbEncryption && str.startsWith(prefix)) {
      // don't encrypt encrypted data.
      return str;
    }

    const cipher = crypto.createCipheriv(aesAlgName, this.curKey, this.curIV);
    let encrypted = cipher.update(str, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    encrypted = prefix + encrypted;

    return encrypted;
  }

  encrypt<T extends object, K extends keyof T>(data: T, keys: K[]): T {
    const result = { ...data };

    for (const key of keys) {
      const value = get(data, key);

      if (value && typeof value === 'string') {
        set(result, key, this.encryptString(value));
      }
    }

    return result;
  }

  private convertBuf(bufArg: Buffer) {
    const buf = Buffer.from(bufArg);
    for (let i = 0; i < buf.length; i += 1) {
      // tslint:disable-next-line
      buf[i] ^= xxx;
    }
    return buf;
  }

  private loadKey(password: Buffer) {
    const passwdBuf = Buffer.from(password);
    const encrypted = readFileSync(this.shmey);
    const decipher = crypto.createDecipher(aesAlgName, passwdBuf);
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);
    return {
      curIV: decrypted.slice(aesKeyLength, aesKeyLength + iVLength),
      curKey: decrypted.slice(0, aesKeyLength),
    };
  }

  private loadPasswordAndKey() {
    const pwd = this.loadPwd();
    return this.loadKey(pwd);
  }

  private loadPwd() {
    const buf = readFileSync(this.shmaswd);
    return this.convertBuf(buf);
  }
}

@Module({
  exports: [CryptoService],
  providers: [CryptoService],
})
export class CryptoModule {}
