export declare class UtilsService {
    static toDto<T, E>(model: new (entity: E, options?: any) => T, entity: E, options?: any): T;
    static toDto<T, E>(model: new (entity: E, options?: any) => T, entity: E[], options?: any): T[];
    static generateHash(password: string): string;
    static validateHash(password: string, hash: string): Promise<boolean>;
    static generateRandomInteger(min: number, max: number): number;
    static generateRandomString(length: number): string;
    static getAge(d1: Date, d2?: Date): number;
    static capitalizeName(name: string): string;
    static encodeString(text: string): string;
    static mergeObject: (A: any, B: any) => any;
    static getLocaleDate: (isoString: string, timeZone?: string) => string;
    static cleanNullObject: <T>(obj: any) => T;
    static isNullOrUndefined: (value: any) => boolean;
    static transformEndOfDate(date: Date | string): Date | null;
    static isFutureDate(value: any): boolean;
    static isActiveByDate(effectDate: Date, inactiveDate: Date): boolean;
    static base64Encode(text: string): string;
    static base64Decode(text: string): string;
    static randomString: (length?: number) => string;
}
