"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const assert_1 = require("assert");
const crypto = require("crypto");
const fs_1 = require("fs");
const lodash_1 = require("lodash");
const path_1 = require("path");
const aesAlgName = 'aes256';
const aesKeyLength = 256 / 8;
const iVLength = 128 / 8;
const xxx = 18;
let CryptoService = class CryptoService {
    constructor() {
        assert_1.ok(process.env.smp_cryptoKeysDir, 'smp_cryptoKeysDir is not set');
        const dataPath = process.env.smp_cryptoKeysDir;
        const ngPrefix = '-' + 'no-' + 'git';
        this.shmey = path_1.join(dataPath, 'par' + 'ams' + ngPrefix);
        this.shmaswd = path_1.join(dataPath, 'par' + 'ams1' + ngPrefix);
        const { curIV, curKey } = this.loadPasswordAndKey();
        this.curIV = curIV;
        this.curKey = curKey;
    }
    decryptString(str) {
        const decipher = crypto.createDecipheriv(aesAlgName, this.curKey, this.curIV);
        let decrypted = decipher.update(str, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
    decrypt(data, keys) {
        const result = Object.assign({}, data);
        for (const key of keys) {
            const value = lodash_1.get(data, key);
            if (value && typeof value === 'string') {
                const decryptedValue = this.decryptString(value);
                lodash_1.set(result, key, decryptedValue);
            }
        }
        return result;
    }
    convertBuf(bufArg) {
        const buf = Buffer.from(bufArg);
        for (let i = 0; i < buf.length; i += 1) {
            buf[i] ^= xxx;
        }
        return buf;
    }
    loadKey(password) {
        const passwdBuf = Buffer.from(password);
        const encrypted = fs_1.readFileSync(this.shmey);
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
    loadPasswordAndKey() {
        const pwd = this.loadPwd();
        return this.loadKey(pwd);
    }
    loadPwd() {
        const buf = fs_1.readFileSync(this.shmaswd);
        return this.convertBuf(buf);
    }
};
CryptoService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [])
], CryptoService);
exports.CryptoService = CryptoService;
let CryptoModule = class CryptoModule {
};
CryptoModule = __decorate([
    common_1.Module({
        exports: [CryptoService],
        providers: [CryptoService],
    })
], CryptoModule);
exports.CryptoModule = CryptoModule;
//# sourceMappingURL=crypto.module.js.map