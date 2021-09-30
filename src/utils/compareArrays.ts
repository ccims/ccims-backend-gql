/**
 * Deep compare for two arrays
 * @param a First element
 * @param b Second element
 * @returns The comparison result
 */
export function arrayCompare(a: any[], b: any[]): boolean {
    return a.length == b.length && a.every(item => b.includes(item)) && b.every(item => a.includes(item));
}