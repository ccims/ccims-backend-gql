export default class PreconditionCheck {

    public static checkString(args: any, property: string, maxLength?: number): string {
        if (typeof args[property] === "string") {
            if (maxLength && maxLength > 0) {
                if (args[property].length > maxLength) {
                    throw new Error(`The ${property} input must have a length of max. ${maxLength} characters`);
                }
            }
            return args[property];
        } else {
            throw new Error(`The ${property} input must be, if set, a string`);
        }
    }

    public static checkNullableString(args: any, property: string, maxLength?: number): string | undefined {
        return PreconditionCheck.checkNullable(args, property, () => PreconditionCheck.checkString(args, property, maxLength));
    }

    public static checkStringList(args: any, property: string, maxStrLength?: number, maxArrayLength?: number): string[] {
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

    public static checkNullableStringList(args: any, property: string, maxStrLength?: number, maxArrayLength?: number): string[] | undefined {
        return PreconditionCheck.checkNullable(args, property, () => this.checkStringList(args, property, maxStrLength, maxArrayLength));
    }

    public static checkEnum<TEnum>(args: any, property: string, enumType: any): TEnum {
        if (!Object.values(enumType).includes(args[property])) {
            const value = enumType[args[property]];
            if (value) {
                return value as TEnum;
            }
            throw new Error(`The ${property} input must be a valid enum item`);
        }
        return args[property];
    }

    public static checkNullableEnum<TEnum>(args: any, property: string, enumType: any): TEnum | undefined {
        return PreconditionCheck.checkNullable(args, property, () => PreconditionCheck.checkEnum(args, property, enumType));
    }

    public static checkDate(args: any, property: string, earliest?: Date, latest?: Date): Date {
        if (typeof args[property] === "object" && args[property] instanceof Date) {
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

    public static checkNullableDate(args: any, property: string, earliest?: Date, latest?: Date): Date | undefined {
        return PreconditionCheck.checkNullable(args, property, () => PreconditionCheck.checkDate(args, property, earliest, latest));
    }

    public static checkTimespan(args: any, property: string, maxTimespan?: number): number {
        if (typeof args[property] === "number") {
            const timespan: number = args[property];
            if (!Number.isSafeInteger(timespan)) {
                throw new Error(`The ${property} input must be a integer number`);
            }
            if (!isFinite(timespan) || timespan < 0) {
                throw new Error(`The ${property} input must be a finite number >=0`);
            }
            if (maxTimespan != undefined && timespan > maxTimespan) {
                throw new Error(`The ${property} must be <= ${maxTimespan}`);
            }
            return timespan;
        }
        throw new Error(`The ${property} input must be a valid timepan (whole number in milliseconds) greater than 0 or \`undefined\``);
    }

    public static checkNullableTimespan(args: any, property: string, maxTimespan?: number): number | undefined {
        return PreconditionCheck.checkNullable(args, property, () => PreconditionCheck.checkTimespan(args, property, maxTimespan));
    }

    public static checkInteger(args: any, property: string, minInt?: number, maxInt?: number): number {
        if (typeof args[property] === "number") {
            const integer: number = args[property];
            if (!Number.isSafeInteger(integer)) {
                throw new Error(`The ${property} input must be a integer number`);
            }
            if (minInt != undefined && integer < minInt) {
                throw new Error(`The ${property} input must be >= ${minInt}`);
            }
            if (maxInt != undefined && integer > maxInt) {
                throw new Error(`The ${property} input must be <= ${maxInt}`);
            }
            return integer;
        }
        throw new Error(`The ${property} input must be a valid integer`);
    }

    public static checkNullableInteger(args: any, property: string, minInt?: number, maxInt?: number): number | undefined {
        return PreconditionCheck.checkNullable(args, property, () => PreconditionCheck.checkInteger(args, property, minInt, maxInt));
    }

    /**
     * Checks a parameter
     * If null or undefined is provided undefined is returned
     * Otherwise checkValue(args, property) is returned
     */
    public static checkNullable<T>(args: any, property: string, checkValue: () => T): T | undefined {
        if (args[property] == undefined) {
            return undefined;
        } else {
            return checkValue();
        }
    }

    /**
     * Checks a parameter
     * If null is provided, null is returned
     * If undefined is provided, undefined is returned
     * Otherwise checkValue(args, property) is returned
     */
    public static checkNullableKeepNull<T>(args: any, property: string, checkValue: () => T): T | undefined | null {
        if (args[property] === undefined) {
            return undefined;
        } else if (args[property] === null) {
            return null;
        } else {
            return checkValue();
        }
    }

}