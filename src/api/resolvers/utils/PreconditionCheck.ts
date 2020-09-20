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

    public static checkEnum<TEnum>(args: any, property: string, enumType: any): TEnum {
        if (!args[property]) {
            throw new Error(`The ${property} input must be set`);
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
}