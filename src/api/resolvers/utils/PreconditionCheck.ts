import { ImsType } from "../../../common/nodes/ImsSystem";

export default class PreconditionCheck {
    public static checkString(args: any, property: string, maxLength?: number): string {
        const checked = PreconditionCheck.checkNullableString(args, property, maxLength);
        if (typeof checked !== "string") {
            throw new Error(`The ${property} input must be set`);
        }
        return checked;
    }

    public static checkNullableString(args: any, property: string, maxLength?: number): string | undefined {
        if (typeof args[property] === "string") {
            if (maxLength && maxLength > 0) {
                if (args[property].length > maxLength) {
                    throw new Error(`The ${property} input must have a length of max. ${maxLength} characters`);
                }
            }
            return args[property];
        } else if (typeof args[property] === "undefined") {
            return undefined;
        } else {
            throw new Error(`The ${property} input must be, if set, a string`);
        }
    }

    public static checkStringList(args: any, property: string, maxStrLength?: number, maxArrayLength?: number): string[] {
        const checked = PreconditionCheck.checkNullableStringList(args, property, maxStrLength, maxArrayLength);
        if (typeof checked === "undefined") {
            throw new Error(`The ${property} input must be set`);
        }
        return checked;
    }

    public static checkNullableStringList(args: any, property: string, maxStrLength?: number, maxArrayLength?: number): string[] | undefined {
        if (typeof args[property] === "undefined") {
            return undefined;
        } else {
            if (!Array.isArray(args[property])) {
                throw new Error(`The ${property} input must be, if set, a valid string array`);
            }
            const list: any[] = args[property];
            if (maxArrayLength && list.length > maxArrayLength) {
                throw new Error(`The ${property} input array cant have more than ${maxArrayLength} elements`);
            }
            if (list.some(obj => typeof obj !== "string")) {
                throw new Error(`The ${property} input must be a valid list of strings`);
            }
            if (maxStrLength && list.some(str => (str as string).length > maxStrLength)) {
                throw new Error(`The strings in the ${property} input array must have a length of max. ${maxStrLength} characters`);
            }
            return list;
        }
    }

    public static checkNonNull(args: any, property: string): any {
        if (typeof args[property] === "undefined" || args[property] === null) {
            throw new Error(`The ${property} input must be set and can't be undefined`);
        }
        return args[property];
    }

    public static checkNullableEnum<TEnum>(args: any, property: string, enumType: any): TEnum | undefined {
        if (typeof args[property] === "undefined") {
            return undefined;
        }
        if (!Object.values(enumType).includes(args[property])) {
            const value = enumType[args[property]];
            if (value) {
                return value as TEnum;
            }
            throw new Error(`The ${property} input must be a valid enum item`);
        }
        return args[property];
    }

    public static checkEnum<TEnum>(args: any, property: string, enumType: any): TEnum {
        const value = this.checkNullableEnum<TEnum>(args, property, enumType);
        if (typeof value === "undefined") {
            throw new Error(`The ${property} input must be set`);
        }
        return value;
    }

    public static checkNullableDate(args: any, property: string, earliest?: Date, latest?: Date): Date | undefined {
        if (typeof args[property] === "undefined") {
            return undefined;
        } else if (typeof args[property] === "object" && args[property] instanceof Date) {
            const date: Date = args[property];
            if (earliest && earliest > date) {
                throw new Error(`The ${property} input must be a date after ${earliest.toISOString()}`);
            }
            if (latest && latest < date) {
                throw new Error(`The ${property} input must be a date before ${latest.toISOString()}`);
            }
            if (new Date(0) <= date) {
                return date;
            }
        }
        throw new Error(`The type given for the ${property} input must be a date after ${new Date(0).toISOString()} or undefined`);
    }

    public static checkDate(args: any, property: string, earliest?: Date, latest?: Date): Date {
        const date = this.checkNullableDate(args, property, earliest, latest);
        if (typeof date === "undefined") {
            throw new Error(`The ${property} input must be a date and can't be \`undefined\``);
        }
        return date;
    }

    public static checkNullableTimespan(args: any, property: string, maxTimespan?: number): number | undefined {
        if (typeof args[property] === "undefined") {
            return undefined;
        } else if (typeof args[property] === "number") {
            const timespan: number = args[property];
            if (!Number.isSafeInteger(timespan)) {
                throw new Error(`The ${property} input must be a integer number`);
            }
            if (!isFinite(timespan) || timespan < 0) {
                throw new Error(`The ${property} input must be a finite number >=0`);
            }
        }
        throw new Error(`The ${property} input must be a valid timepan (whole number in milliseconds) greater than 0 or \`undefined\``);
    }

    public static checkTimespan(args: any, property: string, maxTimespan?: number): number {
        const timespan = this.checkTimespan(args, property, maxTimespan);
        if (typeof timespan === "undefined") {
            throw new Error(`The ${property} input must be a non null timespan (whole number in milliseconds)`);
        }
        return timespan;
    }
}